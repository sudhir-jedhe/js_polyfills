# Programmatic Navigation After a Form Submission

```jsx
function SignupForm() {
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await createAccount();
    navigate('/welcome', { replace: true });
  }
  return <form onSubmit={handleSubmit}>...</form>;
}
```
