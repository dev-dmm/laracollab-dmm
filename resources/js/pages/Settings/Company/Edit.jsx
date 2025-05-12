import ActionButton from '@/components/ActionButton';
import useForm from '@/hooks/useForm';
import ContainerBox from '@/layouts/ContainerBox';
import Layout from '@/layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import {
  Box,
  Fieldset,
  FileInput,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

const CompanyEdit = () => {
  const {
    item,
    dropdowns: { countries, currencies },
  } = usePage().props;

  const [form, submit, updateValue] = useForm('post', route('settings.company.update'), {
    _method: 'put',
    logo: null,
    name: item.name || '',
    address: item.address || '',
    postal_code: item.postal_code || '',
    city: item.city || '',
    country_id: item.country_id || '',
    currency_id: item.currency_id || '',
    email: item.email || '',
    phone: item.phone || '',
    web: item.web || '',
    iban: item.iban || '',
    swift: item.swift || '',
    business_id: item.business_id || '',
    tax_id: item.tax_id || '',
    vat: item.vat || '',
    tax: item.tax / 100 || 0,
  });

  return (
    <>
      <Grid justify='space-between' align='flex-end' gutter='xl' mb={35}>
        <Grid.Col span='auto'>
          <Title order={1}>Η Εταιρεία Μου</Title>
        </Grid.Col>
        <Grid.Col span='content'></Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={e => submit(e, { forceFormData: true })}>
          <Grid justify='flex-start' align='center' gutter='lg'>
            <Grid.Col span='content'>
              {item.logo || form.data.logo ? (
                <Image
                  src={form.data.logo === null ? item.logo : URL.createObjectURL(form.data.logo)}
                  w={240}
                  h={64}
                />
              ) : (
                <Box w={240} h={64} bg='#25262b' align='center' pt='lg' opacity={0.6}>
                  Λογότυπο Εταιρείας
                </Box>
              )}
            </Grid.Col>
            <Grid.Col span='auto'>
              <FileInput
                label='Λογότυπο'
                placeholder='Επιλέξτε εικόνα'
                accept='image/png,image/jpeg'
                onChange={image => updateValue('logo', image)}
                clearable
                error={form.errors.logo}
                disabled={!can('edit owner company')}
              />
              <Text size='xs' c='dimmed' mt='sm'>
                240px × 64px (αναλογία 15:4)
              </Text>
            </Grid.Col>
          </Grid>

          <TextInput
            label='Όνομα'
            placeholder='Όνομα εταιρείας'
            required
            mt='md'
            value={form.data.name}
            onChange={e => updateValue('name', e.target.value)}
            error={form.errors.name}
            disabled={!can('edit owner company')}
          />

          <Fieldset legend='Τοποθεσία' mt='xl'>
            <TextInput
              label='Διεύθυνση'
              placeholder='Διεύθυνση'
              value={form.data.address}
              onChange={e => updateValue('address', e.target.value)}
              error={form.errors.address}
              disabled={!can('edit owner company')}
            />

            <Group grow>
              <TextInput
                label='Τ.Κ.'
                placeholder='Ταχυδρομικός Κώδικας'
                mt='md'
                value={form.data.postal_code}
                onChange={e => updateValue('postal_code', e.target.value)}
                error={form.errors.postal_code}
                disabled={!can('edit owner company')}
              />

              <TextInput
                label='Πόλη'
                placeholder='Πόλη'
                mt='md'
                value={form.data.city}
                onChange={e => updateValue('city', e.target.value)}
                error={form.errors.city}
                disabled={!can('edit owner company')}
              />
            </Group>

            <Select
              label='Χώρα'
              placeholder='Επιλέξτε χώρα'
              mt='md'
              searchable
              value={form.data.country_id?.toString()}
              onChange={value => updateValue('country_id', value)}
              data={countries}
              error={form.errors.country_id}
              disabled={!can('edit owner company')}
            />
          </Fieldset>

          <Fieldset legend='Στοιχεία' mt='xl'>
            <TextInput
              label='ΑΦΜ Εταιρείας'
              placeholder='ΑΦΜ ή Επιχειρηματικό ΑΦΜ'
              value={form.data.business_id}
              onChange={e => updateValue('business_id', e.target.value)}
              error={form.errors.business_id}
              disabled={!can('edit owner company')}
            />

            <TextInput
              label='Αριθμός Φορολογικού Μητρώου'
              placeholder='ΑΦΜ'
              mt='md'
              value={form.data.tax_id}
              onChange={e => updateValue('tax_id', e.target.value)}
              error={form.errors.tax_id}
              disabled={!can('edit owner company')}
            />

            <TextInput
              label='ΦΠΑ'
              placeholder='Αρ. ΦΠΑ'
              mt='md'
              value={form.data.vat}
              onChange={e => updateValue('vat', e.target.value)}
              error={form.errors.vat}
              disabled={!can('edit owner company')}
            />
          </Fieldset>

          <Fieldset legend='Οικονομικά' mt='xl'>
            <TextInput
              label='IBAN'
              placeholder='IBAN'
              value={form.data.iban}
              onChange={e => updateValue('iban', e.target.value)}
              error={form.errors.iban}
              disabled={!can('edit owner company')}
            />

            <TextInput
              label='SWIFT'
              placeholder='SWIFT'
              mt='md'
              value={form.data.swift}
              onChange={e => updateValue('swift', e.target.value)}
              error={form.errors.swift}
              disabled={!can('edit owner company')}
            />

            <Group grow>
              <Select
                label='Νόμισμα'
                placeholder='Επιλέξτε νόμισμα'
                required
                mt='md'
                searchable
                value={form.data.currency_id?.toString()}
                onChange={value => updateValue('currency_id', value)}
                data={currencies}
                error={form.errors.currency_id}
                disabled={!can('edit owner company')}
              />

              <NumberInput
                label='Φόρος'
                required
                allowNegative={false}
                clampBehavior='strict'
                decimalScale={2}
                fixedDecimalScale
                suffix='%'
                mt='md'
                value={form.data.tax}
                onChange={value => updateValue('tax', value)}
                error={form.errors.tax}
                disabled={!can('edit owner company')}
              />
            </Group>
          </Fieldset>

          <Fieldset legend='Επικοινωνία' mt='xl'>
            <Group grow>
              <TextInput
                label='Email'
                placeholder='Email'
                value={form.data.email}
                onChange={e => updateValue('email', e.target.value)}
                error={form.errors.email}
                disabled={!can('edit owner company')}
              />

              <TextInput
                label='Τηλέφωνο'
                placeholder='Τηλέφωνο'
                value={form.data.phone}
                onChange={e => updateValue('phone', e.target.value)}
                error={form.errors.phone}
                disabled={!can('edit owner company')}
              />
            </Group>

            <TextInput
              label='Ιστότοπος'
              placeholder='www.εταιρεία.gr'
              mt='md'
              value={form.data.web}
              onChange={e => updateValue('web', e.target.value)}
              error={form.errors.web}
              disabled={!can('edit owner company')}
            />
          </Fieldset>

          <Group justify='flex-end' mt='xl'>
            {can('edit owner company') && (
              <ActionButton loading={form.processing}>Αποθήκευση</ActionButton>
            )}
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

CompanyEdit.layout = page => <Layout title='Επεξεργασία Εταιρείας'>{page}</Layout>;

export default CompanyEdit;
