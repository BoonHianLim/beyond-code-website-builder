import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

"""
reranker monot5
hyde expansion

"""

TEMPLATES = [
    "Online Store",
    "Agency",
    "Ecommerce",
    "Login Page",
    "Portfolio",
    "Business",
    "Corporate",
    "Error",
    "Education",
    "Event",
    "Hotel",
    "Magazine",
    "News",
    "Personal website",
    "Photography",
    "Real estate",
    "Restaurant",
    "Store",
    "Travel",
    "Wedding",
    "Web application"
]


def get_model():
    # Load the model
    return SentenceTransformer('all-MiniLM-L6-v2')


def init_vector_db(model: SentenceTransformer):
    # Compute embeddings for each template
    template_embeddings = model.encode(TEMPLATES, convert_to_tensor=True)

    # Convert embeddings to numpy array (if not already)
    embeddings_np = template_embeddings.cpu().detach().numpy()
    d = embeddings_np.shape[1]  # Dimensionality of embeddings

    # Create a FAISS index using L2 (Euclidean) or cosine similarity
    index = faiss.IndexFlatL2(d)
    # Add your template vectors
    index.add(embeddings_np)  # pylint: disable=no-value-for-parameter
    return index


def match(input: str, model: SentenceTransformer, index: faiss.IndexFlatL2):
    user_embedding = model.encode([input], convert_to_tensor=True)
    user_embedding_np = user_embedding.cpu().detach().numpy()

    # Search for the 1 nearest neighbor
    k = 1
    distances, indices = index.search(user_embedding_np, k)

    # Get the matching template
    best_template = TEMPLATES[indices[0][0]]
    return best_template


if __name__ == "__main__":
    model = get_model()
    index = init_vector_db(model)
    while True:
        user_prompt = input("Enter your prompt: ")
        if user_prompt == "exit":
            break
        best_template = match(user_prompt, model, index)
        print("Best template:", best_template)
