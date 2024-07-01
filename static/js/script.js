async function predictEntities() {
  const inputText = document.getElementById("inputText").value.trim();
  console.log("Input text:", inputText); // Log the input text

  fetch("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: inputText }),
  })
    .then((response) => {
      console.log("Response status:", response.status); // Log the response status
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data); // Log the response data
      displayResults(data.results, data.country_names, data.years);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayResults(entities, countryNames, years) {
  console.log("Displaying results:", entities); // Log the entities being displayed
  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Get the input text to replace entities with dropdowns
  const inputText = document.getElementById("inputText").value.trim();

  // Function to create a dropdown list for an entity
  function createDropdown(entityText, options) {
    let select = document.createElement("select");

    // Normalize entityText for comparison
    const normalizedEntityText = entityText.trim().toLowerCase();

    // Append <option> elements to the <select>
    options.forEach((optionText) => {
      let option = document.createElement("option");
      option.value = optionText.trim().toLowerCase();
      option.textContent = optionText;

      select.appendChild(option);
    });

    // Set the selected value directly
    select.value = normalizedEntityText;

    return select;
  }

  // Replace entities in the input text with dropdowns
  let modifiedText = inputText;

  const ids = entities.map((entity, index) => {
    const id = `REPLACEME-${index}`;
    modifiedText = modifiedText.replace(
      entity.text,
      `<span id="${id}"> </span>`
    );
    return id;
  });

  // Create a container to hold the modified text with dropdowns
  let container = document.createElement("div");
  container.innerHTML = modifiedText;
  resultsDiv.appendChild(container);

  entities.forEach((entity, index) => {
    let options = [];
    if (entity.label === "country") {
      options = countryNames;
    } else if (entity.label === "year") {
      options = years;
    }

    const dropdown = createDropdown(entity.text, options);
    const id = ids[index];
    const slot = document.getElementById(id);
    slot.replaceWith(dropdown);
  });
}
