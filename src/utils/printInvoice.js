export const printInvoice = () => {
  const content = document.getElementById("invoice").innerHTML;
  const win = window.open("", "", "width=900,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
      </head>
      <body>${content}</body>
    </html>
  `);

  win.document.close();
  win.print();
};