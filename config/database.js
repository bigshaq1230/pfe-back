import { connect  } from '@existdb/node-exist'
const conn = {
  basic_auth: {
    user: 'admin',
    pass: '123'
  },
  protocol: 'http:',
  host: 'localhost',
  port: '8080',
  path: '/exist/xmlrpc'
}

const db =  await connect(conn);
export default db;
