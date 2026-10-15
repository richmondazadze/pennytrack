// PDF report of all income and expenses. Moved out of the old header component so
// any screen can trigger it with the data already in the finance context.
import { reportLogo } from "./report-logo";
import { formatCurrency } from "./utlis";
import { toDate } from "./finance";

const FOREST = [14, 59, 46];
const INK = [18, 25, 22];
const MUTED = [90, 102, 96];
const INCOME = [18, 183, 106];
const EXPENSE = [240, 68, 56];

export async function generateReport({ user, income, expenses, currency }) {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 12;
  const columnWidth = (pageWidth - 2 * margin) / 2;
  let left = margin;
  let right = margin;

  const money = (amount) =>
    formatCurrency(amount, currency).replace("₵", "GHS ").replace("−", "-");

  function addWatermark() {
    const size = 85;
    doc.addImage(reportLogo, "PNG", (pageWidth - size) / 2, (pageHeight - size) / 2, size, size, undefined, "FAST");
  }

  function addPage() {
    doc.addPage();
    addWatermark();
    left = margin;
    right = margin;
  }

  function checkPageBreak(column, height = 10) {
    const y = column === "left" ? left : right;
    if (y + height > pageHeight - margin) addPage();
  }

  const dateText = (value) => {
    const d = toDate(value);
    return d ? d.toDateString() : "Unknown date";
  };

  addWatermark();
  doc.setFont("helvetica");

  // Header band
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setFillColor(200, 242, 80);
  doc.circle(pageWidth - margin - 3, 12, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Income and Expense Report", margin, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 242, 80);
  doc.text(
    `PennyTrack  ·  ${user.displayName || "Unknown User"}  ·  ${new Date().toLocaleString()}`,
    margin,
    25
  );
  left = right = 48;

  // Income (left column)
  let totalIncome = 0;
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INCOME);
  doc.text("Income", margin, left);
  left += 9;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  [...income]
    .sort((a, b) => (toDate(a.createdAt) || 0) - (toDate(b.createdAt) || 0))
    .forEach((item) => {
      checkPageBreak("left");
      const amount = Number(item.amount) || 0;
      totalIncome += amount;
      const line = `${dateText(item.createdAt)}: ${money(amount)} (${item.description || "Income"})`;
      doc.text(doc.splitTextToSize(line, columnWidth - 6), margin, left);
      left += 7;
    });
  left += 4;
  checkPageBreak("left");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total income: ${money(totalIncome)}`, margin, left);
  left += 14;

  // Expenses (right column)
  let totalExpenses = 0;
  const categoryTotals = {};
  const x = margin + columnWidth;
  doc.setFontSize(15);
  doc.setTextColor(...EXPENSE);
  doc.text("Expenses", x, right);
  right += 9;
  doc.setTextColor(...INK);
  expenses.forEach((expense) => {
    checkPageBreak("right", 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(expense.title || "Untitled", x, right);
    doc.setFont("helvetica", "normal");
    right += 7;
    const items = expense.items || [];
    if (items.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text("No items yet.", x + 4, right);
      doc.setTextColor(...INK);
      right += 7;
    }
    items.forEach((item) => {
      checkPageBreak("right");
      const amount = Number(item.amount) || 0;
      totalExpenses += amount;
      categoryTotals[expense.title] = (categoryTotals[expense.title] || 0) + amount;
      doc.setFontSize(10);
      const note = item.note ? ` (${item.note})` : "";
      doc.text(doc.splitTextToSize(`${dateText(item.createdAt)}: ${money(amount)}${note}`, columnWidth - 8), x + 4, right);
      right += 7;
    });
    right += 4;
  });
  checkPageBreak("right");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total expenses: ${money(totalExpenses)}`, x, right);
  right += 14;

  // Breakdown and summary continue below the taller column
  left = Math.max(left, right) + 4;
  checkPageBreak("left", 20);
  doc.setFontSize(15);
  doc.setTextColor(...FOREST);
  doc.text("Expense breakdown", margin, left);
  left += 9;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, total]) => {
      checkPageBreak("left");
      const pct = totalExpenses ? ((total / totalExpenses) * 100).toFixed(1) : "0.0";
      const color = expenses.find((e) => e.title === category)?.color || "#7B8880";
      doc.setFillColor(color);
      doc.circle(margin + 1.5, left - 1.2, 1.5, "F");
      doc.text(`${category}: ${money(total)} (${pct}%)`, margin + 6, left);
      left += 7;
    });

  left += 8;
  checkPageBreak("left", 34);
  doc.setFillColor(241, 244, 242);
  doc.roundedRect(margin, left - 6, pageWidth - 2 * margin, 32, 4, 4, "F");
  const net = totalIncome - totalExpenses;
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Total income: ${money(totalIncome)}`, margin + 6, left + 2);
  doc.text(`Total expenses: ${money(totalExpenses)}`, margin + 6, left + 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...(net >= 0 ? INCOME : EXPENSE));
  doc.text(`Balance: ${money(net)}`, margin + 6, left + 19);

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  doc.save(`pennytrack_${new Date().toISOString().split("T")[0]}.pdf`);
}
