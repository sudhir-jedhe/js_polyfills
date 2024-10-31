function updateCheckboxHierarchy(event) {
    const checkbox = event.target;
    const isChecked = checkbox.checked;

    // Function to update child checkboxes
    const updateChildren = (checkbox, isChecked) => {
        const children = checkbox.closest('li').querySelectorAll('ul input[type="checkbox"]');
        children.forEach(child => {
            child.checked = isChecked;
            // If you want to trigger the change event on children as well
            child.dispatchEvent(new Event('change'));
        });
    };

    // Function to update parent checkbox
    const updateParent = (checkbox) => {
        const parent = checkbox.closest('li').parentElement.closest('li');
        if (parent) {
            const siblings = Array.from(parent.querySelectorAll('input[type="checkbox"]'));
            const allChecked = siblings.every(sib => sib.checked);
            const anyChecked = siblings.some(sib => sib.checked);

            const parentCheckbox = parent.querySelector('input[type="checkbox"]');
            parentCheckbox.checked = allChecked;
            // If you want to trigger the change event on the parent as well
            parentCheckbox.dispatchEvent(new Event('change'));
        }
    };

    // Update children checkboxes based on the current checkbox state
    updateChildren(checkbox, isChecked);
    
    // Update parent checkbox based on the state of its children
    updateParent(checkbox);
}

// Attach event listeners to existing checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateCheckboxHierarchy);
});

// Do not edit below this line
export default updateCheckboxHierarchy;
