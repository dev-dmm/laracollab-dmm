import ActionButton from '@/components/ActionButton';
import BackButton from '@/components/BackButton';
import useForm from '@/hooks/useForm';
import ContainerBox from '@/layouts/ContainerBox';
import Layout from '@/layouts/MainLayout';
import { redirectTo } from '@/utils/route';
import { usePage } from '@inertiajs/react';
import {
  Anchor,
  Breadcrumbs,
  Fieldset,
  Grid,
  Group,
  MultiSelect,
  Select,
  TextInput,
  Title,
} from '@mantine/core';

const ClientCompanyCreate = () => {
  const {
    dropdowns: { clients, countries, currencies, defaultCurrencyId, statuses },
  } = usePage().props;
  const [form, submit, updateValue] = useForm('post', route('clients.companies.store'), {
    name: '',
    address: '',
    postal_code: '',
    city: '',
    country_id: '',
    currency_id: defaultCurrencyId || '',
    email: '',
    phone: '',
    web: '',
    iban: '',
    swift: '',
    business_id: '',
    tax_id: '',
    vat: '',
    clients: route().params?.client_id ? [route().params.client_id] : [],
    status_id: '', 
  });

  return (
    <>
      <Breadcrumbs
        fz={14}
        mb={30}
      >
        <Anchor
          href='#'
          onClick={() => redirectTo('clients.companies.index')}
          fz={14}
        >
          Companies
        </Anchor>
        <div>Create</div>
      </Breadcrumbs>

      <Grid
        justify='space-between'
        align='flex-end'
        gutter='xl'
        mb='lg'
      >
        <Grid.Col span='auto'>
          <Title order={1}>Create company</Title>
        </Grid.Col>
        <Grid.Col span='content'></Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={submit}>
          <TextInput
            label='Name'
            placeholder='Company name'
            required
            value={form.data.name}
            onChange={e => updateValue('name', e.target.value)}
            error={form.errors.name}
          />

          <Select
            label='Default currency'
            placeholder='Select currency'
            required
            mt='md'
            searchable={true}
            value={form.data.currency_id}
            onChange={value => updateValue('currency_id', value)}
            data={currencies}
            error={form.errors.currency_id}
          />

          <MultiSelect
            label='Clients'
            placeholder='Select clients'
            required
            mt='md'
            value={form.data.clients}
            onChange={values => updateValue('clients', values)}
            data={clients}
            error={form.errors.clients}
          />

          <Select
            label="Default currency"
            placeholder="Select currency"
            mt="md"
            searchable
            value={form.data.currency_id}
            onChange={value => updateValue('currency_id', value)}
            data={currencies}
            error={form.errors.currency_id}
          />

          <Select
            label="Status"
            placeholder="Select status"
            mt="md"
            data={statuses.map(status => ({
              value: status.id.toString(),
              label: status.name,
            }))}
            value={form.data.status_id?.toString()}
            onChange={value => updateValue('status_id', value)}
            error={form.errors.status_id}
          />

          <TextInput
            label="Change comment"
            placeholder="Why is the status changing?"
            mt="md"
            value={form.data.status_change_comment}
            onChange={e => updateValue('status_change_comment', e.target.value)}
            error={form.errors.status_change_comment}
          />

          <Fieldset
            legend='Location'
            mt='xl'
          >
            <TextInput
              label='Address'
              placeholder='Address'
              value={form.data.address}
              onChange={e => updateValue('address', e.target.value)}
              error={form.errors.address}
            />

            <Group grow>
              <TextInput
                label='Postal code'
                placeholder='Postal code'
                mt='md'
                value={form.data.postal_code}
                onChange={e => updateValue('postal_code', e.target.value)}
                error={form.errors.postal_code}
              />

              <TextInput
                label='City'
                placeholder='City'
                mt='md'
                value={form.data.city}
                onChange={e => updateValue('city', e.target.value)}
                error={form.errors.city}
              />
            </Group>

            <Select
              label='Country'
              placeholder='Select country'
              mt='md'
              searchable={true}
              value={form.data.country_id}
              onChange={value => updateValue('country_id', value)}
              data={countries}
              error={form.errors.country_id}
            />
          </Fieldset>

          <Fieldset
            legend='Details'
            mt='xl'
          >
            <TextInput
              label='Business ID'
              placeholder='Business ID'
              value={form.data.business_id}
              onChange={e => updateValue('business_id', e.target.value)}
              error={form.errors.business_id}
            />

            <TextInput
              label='Tax ID'
              placeholder='Tax ID'
              mt='md'
              value={form.data.tax_id}
              onChange={e => updateValue('tax_id', e.target.value)}
              error={form.errors.tax_id}
            />

            <TextInput
              label='VAT'
              placeholder='VAT'
              mt='md'
              value={form.data.vat}
              onChange={e => updateValue('vat', e.target.value)}
              error={form.errors.vat}
            />
          </Fieldset>

          <Fieldset
            legend='Finance'
            mt='xl'
          >
            <TextInput
              label='IBAN'
              placeholder='IBAN'
              value={form.data.iban}
              onChange={e => updateValue('iban', e.target.value)}
              error={form.errors.iban}
            />

            <TextInput
              label='SWIFT'
              placeholder='SWIFT'
              mt='md'
              value={form.data.swift}
              onChange={e => updateValue('swift', e.target.value)}
              error={form.errors.swift}
            />

            <Select
              label='Default currency'
              placeholder='Select currency'
              required
              mt='md'
              searchable={true}
              value={form.data.currency_id}
              onChange={value => updateValue('currency_id', value)}
              data={currencies}
              error={form.errors.currency_id}
            />
          </Fieldset>

          <Fieldset
            legend='Contact'
            mt='xl'
          >
            <Group grow>
              <TextInput
                label='Email'
                placeholder='Email'
                value={form.data.email}
                onChange={e => updateValue('email', e.target.value)}
                error={form.errors.email}
              />

              <TextInput
                label='Phone'
                placeholder='Phone'
                value={form.data.phone}
                onChange={e => updateValue('phone', e.target.value)}
                error={form.errors.phone}
              />
            </Group>

            <TextInput
              label='Web'
              placeholder='Web'
              mt='md'
              value={form.data.web}
              onChange={e => updateValue('web', e.target.value)}
              error={form.errors.web}
            />
          </Fieldset>

          <Group
            justify='space-between'
            mt='xl'
          >
            <BackButton route='clients.companies.index' />
            <ActionButton loading={form.processing}>Create</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

ClientCompanyCreate.layout = page => <Layout title='Create company'>{page}</Layout>;

export default ClientCompanyCreate;
