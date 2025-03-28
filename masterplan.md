## masterplan.md

### 1. App Overview and Objectives
- **Objective**: Build a simple, single-user web application for tracking products, costs, sales, and daily profit.
- **Name**: “maya-inventory-manager.”
- **Key Goals**:
  - Allow you to add and manage product details (serial number, name, cost price, shipping cost, sales fee, selling price).
  - Track daily sales by selecting products, quantity, and date.
  - Calculate and display profit for each product and each day.
  - Keep the interface minimal, with a clean, modern look and feel.
  - Provide fast performance, even if the product list grows to hundreds of items.
  - Allow easy editing or deleting of product entries.
  - Store data securely in a way that’s straightforward to maintain and restore (e.g., Supabase or similar service).
  - Run as a single-user application in a Docker container on a local server (Proxmox).

### 2. Target Audience
- **Primary User**: You (the application owner), who needs to track product costs and daily sales. 
- **Usage Context**: Access primarily on the local network via desktop or mobile browser. 
- **Security Model**: Single authenticated user (even if that’s just you), to ensure data privacy.

### 3. Core Features and Functionality
1. **Product Management**  
   - Add new products with essential data fields (serial number, name, cost price, shipping cost, sales fee, selling price).  
   - Edit or delete existing products at any time.  
   - Search or filter products by name or serial number for quick access.
2. **Sales Tracking**  
   - Choose a date, select a product, specify the quantity sold, and record the sale.  
   - Automatically calculate total revenue based on selling price and quantity.  
   - Automatically calculate profit based on cost price, shipping, and sales fee.  
3. **Profit Calculation**  
   - Display per-product and per-sale profit.  
   - Summarize total daily/weekly/monthly profit in a simple, clear format.
4. **Simple Interface**  
   - Minimal but appealing design (cards or tables, easy-to-read fonts, and simple color scheme).  
   - Quick data entry to maintain fast workflow.

### 4. High-Level Technical Stack Recommendations
1. **Frontend**  
   - Use a popular web framework or library for a responsive, minimal UI (e.g., React, Vue, or Svelte).  
   - Keep the interface straightforward: a product list view, a product edit/add form, and a sales entry screen.
2. **Backend**  
   - Could be built with a lightweight server framework (e.g., Node.js with Express, or a minimal service like Deno/Fresh) to handle interactions with the database.  
   - Runs in a Docker container on your local Proxmox server.
3. **Database**  
   - **Supabase** (PostgreSQL-based) recommended if you want an online option.  
   - Alternatively, a self-hosted database (e.g., PostgreSQL or MariaDB) if you prefer local-only storage.  
   - The key is to ensure you can easily back up and restore data.
4. **Deployment**  
   - Containerize the frontend and backend together or separately, then orchestrate with Docker Compose.  
   - Make sure the app is accessible on the LAN.

### 5. Conceptual Data Model
Here’s a high-level idea (not actual code) of how your data might be structured:

- **Products**  
  - **id** (unique identifier)  
  - **serial_number**  
  - **name**  
  - **cost_price**  
  - **shipping_cost**  
  - **sales_fee**  
  - **selling_price**  
  - **created_at / updated_at** (for audit/history)

- **Sales**  
  - **id** (unique identifier)  
  - **product_id** (reference to product)  
  - **quantity_sold**  
  - **date** (the date of the sale)  
  - **total_revenue** (can be derived from selling_price * quantity)  
  - **profit** (can be derived from cost_price + shipping_cost + sales_fee, etc.)  
  - **created_at / updated_at**

### 6. User Interface Design Principles
- **Minimal and Clean**: Use tables or list views for products, with a simple add/edit form.  
- **Focus on Speed**: Quick transitions, minimal clicks for data entry.  
- **Responsive**: Ensure the app looks good on both desktop and mobile web browsers.  
- **Search & Filter**: Provide a basic search bar and optional date range filters.

### 7. Security Considerations
- **Single User Authentication**: Implement a basic login if you wish to secure the app, even if you’re the only user. This could be as simple as a password-protected portal or a token-based auth.  
- **Data Protection**: If using Supabase, secure your database with proper credentials and SSL.  
- **Network Access**: Since you’re hosting locally, ensure your Proxmox and Docker configurations restrict unwanted external access.

### 8. Development Phases or Milestones
1. **Phase 1: Project Setup**  
   - Initialize a minimal frontend application and basic backend/API.  
   - Set up Supabase or local database (if self-hosting).
2. **Phase 2: Products Module**  
   - Implement product creation, editing, and deletion.  
   - Display product list in a table with search functionality.
3. **Phase 3: Sales Module**  
   - Implement a way to record daily sales with date, product, and quantity.  
   - Automate profit calculations.
4. **Phase 4: Reporting & Summaries**  
   - Display daily/weekly/monthly totals in a simple overview.  
   - Provide quick stats for each product’s profitability.
5. **Phase 5: Polishing UI & UX**  
   - Improve layout, colors, and responsiveness.  
   - Enhance search/filter features (optional).
6. **Phase 6: Basic Security**  
   - Implement single-user authentication.  
   - Ensure data is protected (configure Supabase or database access controls).
7. **(Optional) Phase 7: Minor Feature Additions & Future Enhancements**  
   - Add CSV or Excel export.  
   - Integrate with external sales platforms (if desired).

### 9. Potential Challenges and Solutions
- **Data Accuracy**: Manual data entry can lead to errors. Keeping forms simple and clear reduces mistakes.  
- **Scalability**: Single-user scenario likely won’t stress the system, but using a robust database like PostgreSQL ensures you can grow.  
- **User Experience**: Ensure minimal friction when switching between adding products and logging sales.  
- **Security**: Keep your Docker containers and database secure from external intrusion.

### 10. Future Expansion Possibilities
- **Inventory Tracking**: Expand to track stock levels and inventory movement.  
- **Integration**: Connect with e-commerce APIs or point-of-sale systems.  
- **Analytics & Reporting**: Add advanced reporting with charts and visualizations.  
- **Multi-User Management**: Allow multiple users or roles (e.g., read-only vs. admin).

---
