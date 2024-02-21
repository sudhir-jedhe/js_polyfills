// Templating engine function
function render(template, context) {
  // Regular expression to match variables in the template
  const variableRegex = /\{\{(.*?)\}\}/g;
  // Regular expression to match conditionals in the template
  const conditionalRegex = /\{\{if (.*?)\}\}(.*?)\{\{\/if\}\}/gs;

  // Function to replace variables in the template
  function replaceVariables(match, variable) {
    // Get the value of the variable from the context
    const value = context[variable.trim()];
    // Return the value or an empty string if the variable is undefined
    return value !== undefined ? value : "";
  }

  // Function to evaluate conditionals in the template
  function evaluateConditionals(match, condition, content) {
    // Get the value of the conditional expression from the context
    const value = context[condition.trim()];
    // If the condition is truthy, return the content, otherwise return an empty string
    return value ? content.trim() : "";
  }

  // Replace variables in the template
  template = template.replace(variableRegex, replaceVariables);
  // Evaluate conditionals in the template
  template = template.replace(conditionalRegex, evaluateConditionals);

  // Return the rendered template
  return template;
}

// Example usage
const template = `
    {{if loggedIn}}
        Welcome, {{username}}!
    {{else}}
        Please log in.
    {{/if}}
`;

const context = {
  loggedIn: true,
  username: "John",
};

const renderedTemplate = render(template, context);
console.log(renderedTemplate);
