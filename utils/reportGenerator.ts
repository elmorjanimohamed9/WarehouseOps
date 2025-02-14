import { Product } from '@/types/product';

export const generateProductsHTML = (products: Product[]) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: "Helvetica", sans-serif;
            padding: 20px;
          }
          .header {
            text-align: center;
            color: #eab308;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #eab308;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Products Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Total Stock</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr>
                <td>
                  ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="product-image" />`
                    : '<div style="width: 60px; height: 60px; background-color: #f3f4f6; border-radius: 4px;"></div>'
                  }
                </td>
                <td>${product.name}</td>
                <td>${product.type}</td>
                <td>${product.price} MAD</td>
                <td>${product.supplier}</td>
                <td>${product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
};