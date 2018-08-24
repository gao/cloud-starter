
// https://stackoverflow.com/questions/51996328/typescript-why-typing-on-object-literal-vs-variable-are-enforced-differently

interface User {
	id: number;
	username: string;
}

function p(u: Partial<User>) { }

const u1 = { id: 123 }

const u2 = { id: 124, foo: 'bar' };

p(u1); // << Works as expected

// p({ id: 124, foo: 'bar' }); // << ERROR as expected:  ' Object literal may only specify known properties'

p(u2); // << NO ERROR??

// workaround
// const u3: Partial<User> = { id: 124, foo: 'bar' }; // << ERROR as expected
