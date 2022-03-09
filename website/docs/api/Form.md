---
sidebar_position: 1
---

# Form

```ts
export interface FormProps {
  initialValues?: FormInitialValues;
  validateOnSubmit?: boolean;
  validateOnSubmitSyncOnly?: boolean;
  htmlValidate?: boolean;
  children: React.ReactNode;
  onSubmit?: (params: any) => void;
}
```
