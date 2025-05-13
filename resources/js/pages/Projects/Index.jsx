import ArchivedFilterButton from "@/components/ArchivedFilterButton";
import EmptyWithIcon from "@/components/EmptyWithIcon";
import SearchInput from "@/components/SearchInput";
import useAuthorization from "@/hooks/useAuthorization";
import Layout from "@/layouts/MainLayout";
import { redirectTo, reloadWithQuery } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Button, Center, Flex, Grid, Group } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import ProjectCard from "./Index/ProjectCard";
import { useState } from "react";
import FilterButton from "@/components/Filters/FilterButton"; 

const ProjectsIndex = () => {
  const { items } = usePage().props;
  const { isAdmin } = useAuthorization();

  const search = (search) => reloadWithQuery({ search });

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = items
    .filter((item) => {
      const uncompleted = item.all_tasks_count - item.completed_tasks_count;
      if (statusFilter === "completed") return uncompleted === 0;
      if (statusFilter === "incomplete") return uncompleted > 0;
      return true;
    })
    .sort((a, b) => {
      const aLeft = a.all_tasks_count - a.completed_tasks_count;
      const bLeft = b.all_tasks_count - b.completed_tasks_count;
      return bLeft - aLeft;
    });

  return (
    <>
      <Grid justify="space-between" align="center">
        <Grid.Col span="auto">
          <Group gap="sm">
            <SearchInput placeholder="Search projects" search={search} />
            {isAdmin() && <ArchivedFilterButton />}

            {/* ✅ FILTER BUTTONS */}
            <Group gap={4}>
              <FilterButton
                selected={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </FilterButton>
              <FilterButton
                selected={statusFilter === "incomplete"}
                onClick={() => setStatusFilter("incomplete")}
              >
                Incomplete
              </FilterButton>
              <FilterButton
                selected={statusFilter === "completed"}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </FilterButton>
            </Group>
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          {can("create project") && (
            <Button
              leftSection={<IconPlus size={14} />}
              radius="xl"
              onClick={() => redirectTo("projects.create")}
            >
              Create
            </Button>
          )}
        </Grid.Col>
      </Grid>

      {filteredItems.length ? (
        <Flex mt="xl" gap="lg" justify="flex-start" align="flex-start" direction="row" wrap="wrap">
          {filteredItems.map((item) => (
            <ProjectCard item={item} key={item.id} />
          ))}
        </Flex>
      ) : (
        <Center mih={400}>
          <EmptyWithIcon
            title="No projects found"
            subtitle="or you do not have access to any of them"
            icon={IconSearch}
          />
        </Center>
      )}
    </>
  );
};

ProjectsIndex.layout = (page) => <Layout title="Projects">{page}</Layout>;

export default ProjectsIndex;
