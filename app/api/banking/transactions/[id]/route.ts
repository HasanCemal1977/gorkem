import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactions = await executeQuery(
      `
      SELECT 
        bt.*,
        ba.account_name,
        ba.bank_name
      FROM banking_transactions bt
      LEFT JOIN banking_accounts ba ON bt.account_id = ba.id
      WHERE bt.id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: "Banking transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transactions[0])
  } catch (error) {
    console.error("Banking transaction fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch banking transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      account_id,
      transaction_type,
      amount,
      description,
      transaction_date,
      reference_number,
      category,
      project_id,
      status,
    } = body

    // Get old transaction for balance adjustment
    const oldTransactions = await executeQuery(
      `
      SELECT account_id, transaction_type, amount FROM banking_transactions WHERE id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(oldTransactions) || oldTransactions.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const oldTransaction = oldTransactions[0]

    await executeQuery("START TRANSACTION")

    try {
      // Update transaction
      await executeQuery(
        `
        UPDATE banking_transactions SET
          account_id = ?, transaction_type = ?, amount = ?, description = ?,
          transaction_date = ?, reference_number = ?, category = ?, project_id = ?, status = ?
        WHERE id = ?
      `,
        [
          account_id,
          transaction_type,
          amount,
          description,
          transaction_date,
          reference_number,
          category,
          project_id,
          status,
          params.id,
        ],
      )

      // Reverse old balance change
      const oldBalanceChange =
        oldTransaction.transaction_type === "income" ? -oldTransaction.amount : oldTransaction.amount
      await executeQuery(
        `
        UPDATE banking_accounts 
        SET balance = balance + ? 
        WHERE id = ?
      `,
        [oldBalanceChange, oldTransaction.account_id],
      )

      // Apply new balance change
      const newBalanceChange = transaction_type === "income" ? amount : -amount
      await executeQuery(
        `
        UPDATE banking_accounts 
        SET balance = balance + ? 
        WHERE id = ?
      `,
        [newBalanceChange, account_id],
      )

      await executeQuery("COMMIT")

      return NextResponse.json({ message: "Banking transaction updated successfully" })
    } catch (error) {
      await executeQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Banking transaction update error:", error)
    return NextResponse.json({ error: "Failed to update banking transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get transaction for balance adjustment
    const transactions = await executeQuery(
      `
      SELECT account_id, transaction_type, amount FROM banking_transactions WHERE id = ?
    `,
      [params.id],
    )

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const transaction = transactions[0]

    await executeQuery("START TRANSACTION")

    try {
      // Delete transaction
      await executeQuery(`DELETE FROM banking_transactions WHERE id = ?`, [params.id])

      // Reverse balance change
      const balanceChange = transaction.transaction_type === "income" ? -transaction.amount : transaction.amount
      await executeQuery(
        `
        UPDATE banking_accounts 
        SET balance = balance + ? 
        WHERE id = ?
      `,
        [balanceChange, transaction.account_id],
      )

      await executeQuery("COMMIT")

      return NextResponse.json({ message: "Banking transaction deleted successfully" })
    } catch (error) {
      await executeQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Banking transaction deletion error:", error)
    return NextResponse.json({ error: "Failed to delete banking transaction" }, { status: 500 })
  }
}
