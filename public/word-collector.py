import requests
import json

def create_five_letter_word_files():
    """
    Creates JSON files to hold all five-letter words as object with key/value 
    pairs and array.
    """
    
    url = "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json"
    word_length = 5
    file_name_array = "public/five-letter-words.json"
    file_name_dict = "public/five-letter-words-dict.json"

    try:
        # Request JSON file from URL
        response = requests.get(url)

        # Get dictionary of all words from key/value pairs in JSON file
        data = response.json()

        # Convert dictionary to array of words
        all_words = list(data.keys())

        # Filter array of words to only 5-letter words
        five_letter_words_array = list(filter(lambda str: len(str) == word_length, all_words))
        
        # Create new dictionary from array of only 5-letter words
        five_letter_words_dict = {key: 1 for key in five_letter_words_array}

        # Write array of 5-letter words to JSON file
        with open(file_name_array, 'w') as f:
            json.dump(five_letter_words_array, f, indent=4)

        # Write dictionary of 5-letter words to JSON file
        with open(file_name_dict, 'w') as f:
            json.dump(five_letter_words_dict, f, indent=4)
    except Exception as err:
        print(f"An unexpected error occurred: {err}")

if __name__ == "__main__":
    create_five_letter_word_files()
