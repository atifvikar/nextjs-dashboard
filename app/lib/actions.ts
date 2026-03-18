'use server';
import {z} from "zod";
import { revalidatePath }  from "next/cache";
import {redirect} from "next/navigation";
import postgres from "postgres";
import { DeleteInvoice } from "../ui/invoices/buttons";

const FormDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.string(),
  date: z.string()
});

const CreateInvoice = FormDataSchema.omit({ id: true, date: true });
const UpdateInvoice = FormDataSchema.omit({ id: true, date: true });

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require'
});

export async function createInvoice(data: FormData) {
  const {customerId, amount, status} = CreateInvoice.parse({
    customerId: data.get("customerId"),
    amount: data.get("amount"),
    status: data.get('status')
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
} 

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amount * 100}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
}