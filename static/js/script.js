async function predictEntities() {
    const inputText = document.getElementById('inputText').value.trim();
    console.log('Input text:', inputText); // Log the input text

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
    })
    .then(response => {
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Log the response data
        displayResults(data.results, data.country_names, data.years);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResults(entities, countryNames, years) {
    console.log('Displaying results:', entities); // Log the entities being displayed
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Get the input text to replace entities with dropdowns
    const inputText = document.getElementById('inputText').value.trim();

    // Function to create a dropdown list for an entity
    function createDropdown(entityText, options) {
        let select = document.createElement('select');
    
        // Normalize entityText for comparison
        const normalizedEntityText = entityText.trim().toLowerCase();
    
        // Append <option> elements to the <select>
        options.forEach(optionText => {
            let option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
    
            select.appendChild(option);
        });
    
        // Set the selected value directly
        select.value = options.find(optionText => optionText.trim().toLowerCase() === normalizedEntityText) || '';
    
        // Append to a visible element to force a re-render
        document.body.appendChild(select);
    
        // Remove the select element to avoid affecting the page layout
        document.body.removeChild(select);
    
        // Return the HTML string of the <select> element
        return select.outerHTML;
    }
    
    
    

    // Replace entities in the input text with dropdowns
    let modifiedText = inputText;
    entities.forEach(entity => {
        let options = [];
        if (entity.label === 'country') {
            options = countryNames;
        } else if (entity.label === 'year') {
            options = years;
        }

        const dropdownHTML = createDropdown(entity.text, options);
        // Replace only the first occurrence to avoid replacing entities multiple times
        modifiedText = modifiedText.replace(entity.text, dropdownHTML);
    });

    // Create a container to hold the modified text with dropdowns
    let container = document.createElement('div');
    container.innerHTML = modifiedText;
    resultsDiv.appendChild(container);
}