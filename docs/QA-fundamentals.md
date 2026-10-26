# QA Fundamentals

A concise reference for common quality assurance (QA) and software testing terminology. Use it when learning QA, writing test plans, or talking with developers and stakeholders.

---

## Core concepts

| Term | Definition |
|------|------------|
| **Quality Assurance (QA)** | Processes and activities that help ensure a product meets requirements and is fit for use. QA focuses on prevention and improvement across the whole lifecycle, not only on finding bugs at the end. |
| **Quality Control (QC)** | Activities that check whether the product meets defined standards (e.g. executing tests, reviewing builds). QC is often part of QA but is more verification-oriented. |
| **Software Testing** | Running the software (or reviewing it) to find defects and assess whether it behaves as expected. |
| **Defect / Bug** | A flaw where the product does not match requirements, design, or reasonable user expectations. |
| **Failure** | Observable incorrect behavior at runtime (often caused by a defect). |
| **Error** | A human mistake (e.g. wrong code or wrong test data) that can lead to a defect. |

---

## Verification vs validation

| Term | Question it answers |
|------|---------------------|
| **Verification** | “Did we build it right?” — checking against specs, design, and standards (reviews, inspections, unit tests). |
| **Validation** | “Did we build the right thing?” — checking that the product solves the real user or business need (UAT, beta, field trials). |

---

## Types of testing (by scope)

| Term | Definition |
|------|------------|
| **Unit testing** | Tests the smallest testable pieces (functions, classes, modules), usually automated and run by developers. |
| **Integration testing** | Tests how components work together (APIs, databases, services, UI + backend). |
| **System testing** | Tests the complete, integrated application against requirements in an environment close to production. |
| **End-to-end (E2E) testing** | Simulates real user flows across the full stack (often via browser or mobile automation). |
| **Acceptance testing** | Confirms the system is acceptable for release; **UAT** (user acceptance testing) is done by business users or representatives. |
| **Regression testing** | Re-running tests after changes to ensure existing behavior still works. |
| **Smoke testing** | Quick, shallow check that critical paths work after a build or deploy (“is it worth deeper testing?”). |
| **Sanity testing** | Narrow check on a specific fix or small area after a change. |

---

## Types of testing (by knowledge of internals)

| Term | Definition |
|------|------------|
| **Black-box testing** | Testing based on inputs and expected outputs without looking at internal code structure. |
| **White-box testing** | Testing with knowledge of internal logic, branches, and data paths (often structural or code-coverage driven). |
| **Gray-box testing** | Partial knowledge of internals (e.g. schema, APIs) combined with user-facing behavior. |

---

## Types of testing (by purpose)

| Term | Definition |
|------|------------|
| **Functional testing** | Does the feature do what the requirements say? |
| **Non-functional testing** | How well the system behaves: performance, security, usability, reliability, compatibility, etc. |
| **Exploratory testing** | Simultaneous learning, test design, and execution without fully scripted steps; relies on tester skill and charters. |
| **Ad hoc testing** | Informal testing without a formal plan (less repeatable than exploratory testing with a charter). |
| **Positive testing** | Valid inputs and happy paths. |
| **Negative testing** | Invalid inputs, edge cases, and error handling. |
| **Boundary / edge testing** | Values at limits (min, max, just inside/outside boundaries). |

---

## Common non-functional areas

| Term | Definition |
|------|------------|
| **Performance testing** | Response time, throughput, and resource use under load. |
| **Load testing** | Behavior under expected load. |
| **Stress testing** | Behavior beyond normal capacity until breaking point. |
| **Security testing** | Vulnerabilities, auth, data protection, injection, etc. |
| **Usability testing** | Ease of use with real or representative users. |
| **Compatibility testing** | Browsers, OS versions, devices, screen sizes. |
| **Accessibility (a11y) testing** | WCAG and assistive technology compatibility. |

---

## Test artifacts and process

| Term | Definition |
|------|------------|
| **Test plan** | High-level approach: scope, objectives, resources, schedule, risks, and entry/exit criteria. |
| **Test strategy** | Organization-wide or project-level principles (what to automate, environments, tools, levels of testing). |
| **Test case** | Steps, data, and expected results for a specific scenario. |
| **Test scenario** | A high-level situation to test (may map to one or many test cases). |
| **Test suite** | A grouped set of test cases (e.g. “login regression suite”). |
| **Test data** | Inputs needed to execute tests (valid, invalid, boundary). |
| **Test environment** | Hardware, software, configs, and data used for testing (dev, QA, staging). |
| **Traceability** | Linking requirements → test cases → defects so coverage and impact are visible. |
| **Test execution** | Running tests and recording actual results. |
| **Test report / summary** | What was run, pass/fail, defects found, risks, and release recommendation. |

---

## Defect lifecycle terms

| Term | Definition |
|------|------------|
| **Severity** | Impact on the system or user (e.g. critical, major, minor). |
| **Priority** | Order in which the team should fix it (business urgency). |
| **Reproduce / steps to reproduce** | Exact steps to make the defect appear again. |
| **Fixed / resolved** | Developer addressed the issue in a build. |
| **Retest** | QA verifies the fix in a new build. |
| **Regression (defect context)** | A fix or change broke something that worked before. |
| **Closed / verified** | Fix confirmed; defect no longer open. |
| **Deferred / won’t fix** | Accepted risk or postponed intentionally. |

---

## Automation and CI/CD

| Term | Definition |
|------|------------|
| **Test automation** | Scripts or tools that run tests without manual repetition. |
| **Manual testing** | Human execution and judgment; essential for UX, exploration, and one-off checks. |
| **CI (Continuous Integration)** | Frequent merges with automated builds and tests on each change. |
| **CD (Continuous Delivery / Deployment)** | Automated path to release-ready or production builds (with gates). |
| **Flaky test** | A test that sometimes passes and sometimes fails without a product change (timing, data, environment). |
| **Test oracle** | Expected outcome or mechanism to decide pass vs fail. |

---

## Agile and shift-left

| Term | Definition |
|------|------------|
| **Shift-left** | Doing testing and quality activities earlier (requirements, design, unit tests). |
| **Sprint / iteration testing** | Testing within short development cycles alongside new stories. |
| **Definition of Done (DoD)** | Shared checklist before work is “done” (often includes tests, review, docs). |
| **BDD (Behavior-Driven Development)** | Examples in Given/When/Then form to drive development and tests (e.g. Cucumber, Gherkin). |
| **TDD (Test-Driven Development)** | Write failing tests first, then code until they pass (developer practice). |

---

## Metrics (often used, use with care)

| Term | Definition |
|------|------------|
| **Test coverage** | How much of requirements or code is exercised by tests (not a guarantee of quality). |
| **Pass rate** | Percentage of tests passed in a run. |
| **Defect density** | Defects per size of product (e.g. per story, module, or KLOC). |
| **Escape defect** | A defect found in production after release. |

---

## Entry and exit criteria (examples)

**Entry criteria** — conditions before testing starts (e.g. build deployed, test data ready, critical bugs from last cycle fixed).

**Exit criteria** — conditions to stop testing or approve release (e.g. all planned tests executed, no open critical defects, acceptance sign-off).

---

## Quick glossary

| Acronym | Meaning |
|---------|---------|
| **QA** | Quality Assurance |
| **QC** | Quality Control |
| **SUT / AUT** | System / Application Under Test |
| **UAT** | User Acceptance Testing |
| **E2E** | End-to-end |
| **API** | Application Programming Interface (often tested with integration/API tests) |
| **POC** | Proof of concept (limited testing scope) |
| **RTM** | Requirements Traceability Matrix |

---

## Further reading mindset

Good QA combines **structured testing** (plans, cases, regression) with **critical thinking** (exploration, risk-based focus, clear communication). Prioritize tests by **risk** (what hurts users or the business most if it fails) rather than trying to test everything equally.
