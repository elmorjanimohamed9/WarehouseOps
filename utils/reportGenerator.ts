import { Product } from '@/types/product';

interface ReportOptions {
  title?: string;
  includeTimestamp?: boolean;
  primaryColor?: string;
  currency?: string;
}

export const generateProductsHTML = (
  products: Product[],
  options: ReportOptions = {}
) => {
  const {
    title = 'Products Report',
    includeTimestamp = true,
    primaryColor = '#eab308',
    currency = 'MAD'
  } = options;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const getTotalStock = (product: Product) => {
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  };

  const getStockStatus = (total: number) => {
    if (total === 0) return { color: '#ef4444', text: 'Out of Stock' };
    if (total < 10) return { color: '#f59e0b', text: 'Low Stock' };
    return { color: '#22c55e', text: 'In Stock' };
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            margin: 0;
            color: #1f2937;
          }
          .header {
            text-align: center;
            color: ${primaryColor};
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid ${primaryColor};
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 16px;
            text-align: left;
          }
          th {
            background-color: ${primaryColor};
            color: white;
            font-weight: 600;
            white-space: nowrap;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .product-name {
            font-weight: 500;
          }
          .supplier {
            color: #6b7280;
            font-size: 14px;
          }
          .stock-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
          }
          .summary {
            margin-top: 40px;
            padding: 24px;
            background-color: #f9fafb;
            border-radius: 12px;
          }
          .summary h2 {
            margin: 0 0 16px 0;
            color: ${primaryColor};
          }
          @media print {
            body {
              padding: 20px;
            }
            .stock-status {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          ${includeTimestamp ? `<p>Generated on ${new Date().toLocaleString()}</p>` : ''}
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Details</th>
              <th>Type</th>
              <th>Price</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => {
              const totalStock = getTotalStock(product);
              const status = getStockStatus(totalStock);
              return `
                <tr>
                  <td>
                    ${product.image 
                      ? `<img src="${product.image}" alt="${product.name}" class="product-image" />`
                      : '<div style="width: 80px; height: 80px; background-color: #f3f4f6; border-radius: 8px;"></div>'
                    }
                  </td>
                  <td>
                    <div class="product-name">${product.name}</div>
                    <div class="supplier">${product.supplier}</div>
                  </td>
                  <td>${product.type}</td>
                  <td>${formatCurrency(product.price)}</td>
                  <td>
                    <span class="stock-status" style="background-color: ${status.color}20; color: ${status.color}">
                      ${status.text} (${totalStock})
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="summary">
          <h2>Inventory Summary</h2>
          <p>Total Products: ${products.length}</p>
          <p>Total Stock Value: ${formatCurrency(
            products.reduce((sum, product) => sum + (product.price * getTotalStock(product)), 0)
          )}</p>
          <p>Low Stock Items: ${products.filter(p => getTotalStock(p) < 10).length}</p>
          <p>Out of Stock Items: ${products.filter(p => getTotalStock(p) === 0).length}</p>
        </div>
      </body>
    </html>
  `;
};