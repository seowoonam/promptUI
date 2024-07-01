from flask import Flask, render_template, request, jsonify
from gliner import GLiNER
import pandas as pd
from pathlib import Path

app = Flask(__name__)

# Initialize GLiNER with the base model
model = GLiNER.from_pretrained("urchade/gliner_mediumv2.1")

# Load the CSV data
file_path = Path('./csv/tree_loss.csv')
data = pd.read_csv(file_path)

# Extract unique country names and years
country_names = data['country_name'].unique().tolist()
years = data['year'].unique().tolist()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    # Get the text from the request
    data = request.get_json()
    text = data["text"]

    # Labels for entity prediction
    labels = ["year", "country", "person", "group", "group_by"]

    # Perform entity prediction
    entities = model.predict_entities(text, labels, threshold=0.5)

    # Prepare the results
    results = [{"text": entity["text"], "label": entity["label"]} for entity in entities]

    # Include country names and years in the response
    response = {
        "results": results,
        "country_names": [str(country) for country in country_names],
        "years": [str(year) for year in years]
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run()
