import { hash } from "bcryptjs";

const pass = await hash("123",10);
console.log(pass)