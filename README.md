# 💳 SOT Payment Management System

A modern, responsive **Payment Management Dashboard** built with **React + TypeScript + Tailwind CSS**.  
This system allows you to manage student payments, filter by payment method, search transactions, sort data, and export payment reports as PDF.

---

## 🚀 Features

### 📊 Dashboard Statistics
- ✅ Total Payment Amount
- ✅ Total Students
- ✅ Average Payment
- ✅ Method-wise Payment Breakdown (Bkash, Nagad, Rocket, Bank)

### 📋 Payment List Management
- 🔎 Search by:
  - Phone Number
  - Amount
  - Payment Method
  - Message / TrxID
- 🧮 Sort by:
  - Newest First
  - Oldest First
  - Highest Amount
  - Lowest Amount
- 🎯 Filter by Payment Method
- 🗑️ Delete Payment with Confirmation
- 🧹 **Bulk Delete**: Select multiple payments and delete them at once
- ✏️ **Manual Edit**: Update payment method, amount, phone number, or message
- 🎓 **Course Management**: Admin can add, edit, and delete courses with names and logo URLs
- 🎯 **Course-wise Tracking**: Link payments to specific courses for better organization
- 📊 **Course Statistics**: View total payments collected for each course separately
- 📄 Export Filtered Payments to PDF

### 🔐 Admin & Settings
- 🛡️ **Admin Authentication**: Secure login for managing payments
- ⚙️ **Dynamic Telegram Settings**: Configure Bot Token and Channel ID directly from the UI
- 🔔 **Instant Notifications**: Automatic Telegram alerts for new payments
- 📊 **Summary Reports**: Send daily/weekly payment summaries to Telegram

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| React | Frontend UI |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Supabase | Database & Backend |
| Framer Motion | Animations |
| Lucide React | Icons |
| date-fns | Date Formatting |
| jsPDF | PDF Generation |
| jspdf-autotable | Table Support in PDF |

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/With-ALIF/paymet.git
cd payment
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

---

## 📄 PDF Export

- Generates a professional payment report
- Includes:
  - Title
  - Generated Date
  - Total Payments
  - Total Amount
  - Payment Table

File name format:

```
SOT-Payments-YYYY-MM-DD-HHMM.pdf
```

---

## 📦 Payment Methods Supported

- Bkash
- Nagad
- Rocket
- Bank
- Other

Each method displays:
- Custom logo
- Custom color theme
- Method-wise statistics

---

## 🎨 UI Features

- Glassmorphism card design
- Smooth hover animations
- Responsive layout (Mobile First)
- Scrollable filter pills
- Elegant delete confirmation UI


---

## 📈 Future Improvement 
- CSV Export
- Pagination
- Dark Mode
- Analytics Charts

---

## 👨💻 Author
Md. Alif 

Developed with ❤️ for managing student payments efficiently.
