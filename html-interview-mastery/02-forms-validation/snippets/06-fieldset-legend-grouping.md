# Snippet: `<fieldset>` and `<legend>` Grouping

```html
<form>
  <fieldset>
    <legend>Shipping method</legend>
    <label><input type="radio" name="shipping" value="standard" checked> Standard (5-7 days)</label>
    <label><input type="radio" name="shipping" value="express"> Express (2 days)</label>
    <label><input type="radio" name="shipping" value="overnight"> Overnight</label>
  </fieldset>

  <fieldset>
    <legend>Notification preferences</legend>
    <label><input type="checkbox" name="notify" value="email" checked> Email</label>
    <label><input type="checkbox" name="notify" value="sms"> SMS</label>
    <label><input type="checkbox" name="notify" value="push"> Push notification</label>
  </fieldset>

  <fieldset disabled>
    <legend>Beta features (unavailable on your plan)</legend>
    <label><input type="checkbox" name="beta" value="new-editor"> New editor</label>
  </fieldset>
</form>
```

`disabled` on a `<fieldset>` disables every control inside it in one shot — no need to disable each input individually. `<legend>` is announced by screen readers as introductory context for the whole group, which matters most for radio/checkbox groups where individual `<label>`s alone don't convey what the group as a whole represents.
