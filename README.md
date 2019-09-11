# invoices-app
---
## Environment variables:

  * PORT: app port
  * MYSQL_HOST: mysql host
  * MYSQL_USER: mysql user
  * MYSQL_PASSWORD: mysql password
  * MYSQL_DATABASE: database name

---
## Hash Keys
A set of public and private keys should be generated and placed inside key folder, in the root of the project. These keys should also be sent to the AT.
These keys are used to generate invoices hashes in [saft.js](./src/routes/saft.js).

---
## To Do
1. In the [saft.js](./src/routes/saft.js) file, there are fields which can only be filled after the software is certified by the AT.


2. In [generatePDF.js](./src/utils/generatePDF.js), the certification number should be filled when it exists.
