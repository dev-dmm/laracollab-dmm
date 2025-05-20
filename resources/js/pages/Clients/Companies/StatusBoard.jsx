import Layout from '@/layouts/MainLayout';
import { usePage, router } from '@inertiajs/react';
import { Group, Text, Card, Modal, Textarea, Button } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import classes from './StatusBoard.module.css';

const CompanyStatusBoard = () => {
  const { statuses: initialStatuses = [], companies: initialCompanies = [] } = usePage().props;
  const [statuses, setStatuses] = useState(initialStatuses);
  const [companies, setCompanies] = useState(initialCompanies);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState({});
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only update from props if we don't have local changes
  useEffect(() => {
    if (!Object.keys(isUpdating).length) {
      setStatuses(initialStatuses);
      setCompanies(initialCompanies);
    }
  }, [initialStatuses, initialCompanies]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Reorder within the same status
    if (source.droppableId === destination.droppableId) {
      const statusId = source.droppableId.replace('status-', '');
      const newCompanies = [...companies];
      const filteredCompanies = newCompanies.filter(
        (c) => c.status?.id?.toString() === statusId
      );
      
      const [removed] = filteredCompanies.splice(source.index, 1);
      filteredCompanies.splice(destination.index, 0, removed);
      
      // Update order in the full companies array
      const result = newCompanies.filter(
        (c) => c.status?.id?.toString() !== statusId
      ).concat(filteredCompanies);
      
      setCompanies(result);
    } 
    // Move to a different status
    else {
      const sourceStatusId = source.droppableId.replace('status-', '');
      const destStatusId = destination.droppableId.replace('status-', '');
      
      const companyId = draggableId.replace('company-', '');
      const company = companies.find(c => c.id.toString() === companyId);
      
      if (!company) return;
      
      // Update the company status
      const updatedCompany = {
        ...company,
        status: statuses.find(s => s.id.toString() === destStatusId)
      };
      
      // Update the companies array
      const newCompanies = companies.filter(c => c.id.toString() !== companyId);
      newCompanies.splice(
        destination.index,
        0,
        updatedCompany
      );
      
      setCompanies(newCompanies);
      
      // Store the pending update and open the comment modal
      setPendingUpdate({
        companyId,
        destStatusId,
        newCompanies
      });
      setIsModalOpen(true);
    }
  };

  const confirmStatusUpdate = async () => {
    if (!pendingUpdate) return;
    
    const { companyId, destStatusId, newCompanies } = pendingUpdate;
    
    // Update the UI optimistically
    setCompanies(newCompanies);
    setIsUpdating(prev => ({ ...prev, [companyId]: true }));
    setIsModalOpen(false);
    
    const company = companies.find(c => c.id.toString() === companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    
    console.log('Sending update request:', {
      companyId,
      name: company.name,
      status_id: destStatusId,
      status_change_comment: comment || 'Status changed via drag and drop'
    });
    
    // Reset comment after using it
    setComment('');

    try {
      const response = await fetch(route('clients.companies.status.update', companyId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status_id: destStatusId,
          status_change_comment: comment || 'Status changed via drag and drop'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      const { company: updatedCompany } = await response.json();
      
      // Update the company in the local state with the server response
      setCompanies(prevCompanies => 
        prevCompanies.map(c => 
          c.id.toString() === companyId ? { ...c, ...updatedCompany } : c
        )
      );

      // Clear the updating state on success
      setIsUpdating(prev => {
        const newState = { ...prev };
        delete newState[companyId];
        return newState;
      });
    } catch (error) {
      console.error('Error during status update:', error);
      // Revert on error
      setCompanies(companies);
      setIsUpdating(prev => {
        const newState = { ...prev };
        delete newState[companyId];
        return newState;
      });
      throw error;
    }
  };

  const handleCancelUpdate = () => {
    setPendingUpdate(null);
    setComment('');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={classes.container}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.board}>
          {statuses.map((status, statusIndex) => {
            const companiesWithStatus = companies.filter(
              (company) => company.status?.id === status.id
            );

            return (
              <div 
                key={status.id}
                className={classes.statusColumn}
              >
                <div className={classes.statusHeader}>
                  <Text size="lg" fw={600}>
                    {status.label}
                  </Text>
                </div>

                <Droppable droppableId={`status-${status.id}`} type="company">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${classes.dropZone} ${
                        snapshot.isDraggingOver ? classes.dropZoneActive : ''
                      }`}
                    >
                      {companiesWithStatus.map((company, index) => (
                        <Draggable
                          key={`company-${company.id}`}
                          draggableId={`company-${company.id}`}
                          index={index}
                          isDragDisabled={isDragDisabled}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${classes.draggableItem} ${
                                snapshot.isDragging ? classes.dragging : ''
                              }`}
                              style={provided.draggableProps.style}
                            >
                              <div className={classes.row}>
                                <Card withBorder shadow="none" className={classes.companyCard}>
                                  <Group gap="xs" wrap="nowrap">
                                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                                      <IconGripVertical size={16} stroke={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <Text size="sm" fw={500} lineClamp={1}>
                                        {company.name}
                                      </Text>
                                      {company.email && (
                                        <Text size="xs" color="dimmed" lineClamp={1}>
                                          {company.email}
                                        </Text>
                                      )}
                                    </div>
                                  </Group>
                                </Card>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {companiesWithStatus.length === 0 && (
                        <Text size="sm" color="dimmed" ta="center" py="md">
                          No companies
                        </Text>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
          </div>
        </DragDropContext>
      </div>

      <Modal
        opened={isModalOpen}
        onClose={handleCancelUpdate}
        title="Add a comment (optional)"
        size="md"
      >
        <Textarea
          placeholder="Add a comment about this status change..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          autosize
          minRows={3}
          maxRows={6}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancelUpdate}>
            Cancel
          </Button>
          <Button onClick={confirmStatusUpdate}>
            Confirm Move
          </Button>
        </Group>
      </Modal>
    </>
  );
};

CompanyStatusBoard.layout = (page) => <Layout title="Companies by Status">{page}</Layout>;

export default CompanyStatusBoard;
