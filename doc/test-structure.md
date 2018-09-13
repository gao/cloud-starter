
Tests use the [mocha](https://mochajs.org/) framework with the following structure and best practices. 

> Obvious but important, in all naming convention, no space, only '-' separated for names, and camel case for variables. 

See: 
- [services/web-server/test/test-access-project.ts](services/web-server/test/test-access-project.ts) for an example of a test file.
- [services/web-server/test/t-utils.ts](services/web-server/test/t-utils.ts) (test utilities, decribed below)


**Test File naming (e.g., `services/web-server/test-access-project.ts`)**

- Each test files are under the `test/` folder of their repective service, and all start with the prefix `test-`
- First word after `test-` is the functionality tested, and the following words are for more precision. 
- Basic functionality test should be used `-basic`, such as `test-access-basic.ts` will test the basic of test, where has `test-access-project.ts` will do more test focused on `project` entity access. This allows run the basic test (with mocha `-g`) without having to run all of the test for a given functionality.
- Test utils files are named with `t-...ts`, such as `t-utils.ts` so that they are ran by the Mocha tester, and not confused with real code. 


**Suite naming (e.g., `describe('test-access-project',`**

- A Mocha test suite is defined by `describe` and the name should match the name of the file without the `.ts` extension
- We have ONE test suite (one `decribe`) by `test-...ts` file.


**Test naming (e.g., `it('access-project-viewer', `**

- A Mocha test is defined by `it` and the name should  have the following format
	- Starts with the suite/file name without the `test-` prefix, like `access-project`
	- Add one of more descriptive to concisely identify the test (something short, but meaningfull for making test report as meaningfull as possible)
	- For example for suite `test-access-project` we will have `it('access-project-viewer'` that test the viewer access, and `it('access-project-manager'` for the manager access. 

**Suite initialization**

To minimize repetitive boilerplate code accross while maintaining a flexible and typed test, the approach is to extends the `Mocha.Suite` type with some common test suite functionalities. 

In [services/web-server/test/t-utils.ts](services/web-server/test/t-utils.ts), we extends the `Mocha.Suite` with some application common test object. 

```ts

// extend the Mocha.Suite type with some application common test data and function
declare global {
	namespace Mocha {
		interface Suite {
			// Add an table row to be deleted after the test is ran (will be called in afterEach)
			toClean: (tableName: string, id: any) => this; 

			//// default users/context that can be used in tests
			sysCtx: CommonContext;
			adminCtx: CommonContext;
			userACtx: CommonContext;
			userBCtx: CommonContext;
		}
	}
}

// Note: this needs to be sync and not be awaited, otherwise, should be after the it(...)

// Initialize a test suite for application common test data and behavior
export function initSuite(suite: Mocha.Suite) {
	...
}

```

Each test suite must call the init 

```ts
describe("test-access-project", async function () {

	const suite = initSuite(this);

	// test CRUD  project from same user (i.e. owner)
	it('access-project-self', async function () {
		...
		suite.adminCtx; 
		suite.toClean('project', id);
	}
});
```	





