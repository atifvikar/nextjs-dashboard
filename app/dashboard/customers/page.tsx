import CustomersTable from '@/app/ui/customers/table';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { lusitana } from '@/app/ui/fonts';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Customers', href: '/customers', active: true },
        ]}
      />
      {/* <CustomersTable customers={customers} /> */}
    </main>
  );
}
