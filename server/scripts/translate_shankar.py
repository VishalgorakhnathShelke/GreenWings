import sqlite3
from datetime import datetime, timezone

def main():
    conn = sqlite3.connect('database/greenwings.db')
    cursor = conn.cursor()

    # Get the English record
    cursor.execute("SELECT * FROM success_stories WHERE slug = 'shankar-shinde-nafed' AND language = 'en'")
    en_story = cursor.fetchone()
    if not en_story:
        print("English story not found.")
        return

    columns = [description[0] for description in cursor.description]
    story_dict = dict(zip(columns, en_story))
    
    # Remove the 'id' so it auto-increments
    del story_dict['id']
    
    # Create Marathi translation
    mr_story = story_dict.copy()
    mr_story['language'] = 'mr'
    mr_story['farmerName'] = 'श्री. शंकर नानासाहेब शिंदे'
    mr_story['title'] = 'नाफेड कांदा पणन'
    mr_story['location'] = 'महाराष्ट्र'
    mr_story['cropType'] = 'कांदा'
    mr_story['storyCategory'] = 'बाजारपेठ प्रवेश'
    mr_story['shortQuote'] = '"ग्रीन विंग्सच्या माध्यमातून नाफेडला कांदा विकून मला बाजारभावापेक्षा प्रति क्विंटल १०० ते ५०० रुपये जास्त भाव मिळाला."'
    mr_story['shortSummary'] = 'श्री. शंकर शिंदे यांनी कंपनीच्या विपणन सहाय्याद्वारे आपला कांदा नाफेडला विकला, ज्यामुळे त्यांना चांगला दर आणि थेट बँक पेमेंट मिळाले.'
    mr_story['fullStory'] = 'रब्बी २०२३-२४ आणि खरीप २०२३-२४ हंगामात, श्री. शंकर शिंदे यांनी कंपनीच्या विपणन सहाय्याद्वारे आपला कांदा नाफेडला विकला.\n\nया माध्यमातून विक्री केल्याने त्यांना बाजारभावापेक्षा प्रति क्विंटल १०० ते ५०० रुपये जास्त भाव मिळाला. पैसे थेट त्यांच्या बँक खात्यात जमा झाले, ज्यामुळे पारदर्शक आणि विश्वासार्ह व्यवहार झाला.\n\nचांगल्या दरामुळे, श्री. शिंदे यांना पारंपारिक बाजारपेठेत विक्री करण्याच्या तुलनेत प्रति ट्रॅक्टर ट्रॉली किमान ५,००० रुपयांचे अतिरिक्त उत्पन्न मिळाले.\n\nत्यांच्या अनुभवानुसार, नाफेडला विक्री करण्यासाठी कंपनीने केलेल्या सहकार्यामुळे त्यांना चांगला बाजारभाव मिळण्यास, सुरक्षित पेमेंट मिळण्यास आणि त्यांच्या कांदा शेतीच्या व्यवसायाचा नफा वाढण्यास मदत झाली.'
    mr_story['challenge'] = 'पारंपारिक बाजारपेठेत कांदा विकल्यास अनेकदा कमी दर मिळतो आणि पेमेंटचे चक्र अनिश्चित असते.'
    mr_story['solution'] = 'ग्रीन विंग्सने रब्बी २०२३-२४ आणि खरीप २०२३-२४ हंगामात श्री. शिंदे यांचा कांदा थेट नाफेडला विकण्यासाठी सुविधा उपलब्ध करून दिली.'
    mr_story['result'] = 'बाजारभावापेक्षा प्रति क्विंटल १०० ते ५०० रुपये जास्त दर मिळाला आणि पारदर्शक, थेट बँक पेमेंट सुनिश्चित केले.'
    mr_story['priceBenefit'] = 'प्रति क्विंटल १०० ते ५०० रुपये जास्त दर'
    mr_story['additionalIncome'] = 'प्रति ट्रॅक्टर ट्रॉली किमान ५,००० रुपयांचे अतिरिक्त उत्पन्न'
    mr_story['marketSupport'] = 'नाफेडला थेट विपणन आणि विक्री सहाय्य'

    # Create Hindi translation
    hi_story = story_dict.copy()
    hi_story['language'] = 'hi'
    hi_story['farmerName'] = 'श्री. शंकर नानासाहेब शिंदे'
    hi_story['title'] = 'नाफेड प्याज विपणन'
    hi_story['location'] = 'महाराष्ट्र'
    hi_story['cropType'] = 'प्याज'
    hi_story['storyCategory'] = 'बाजार समर्थन'
    hi_story['shortQuote'] = '"ग्रीन विंग्स के माध्यम से नाफेड को प्याज बेचकर मुझे बाजार भाव से प्रति क्विंटल १०० से ५०० रुपये अधिक दाम मिला।"'
    hi_story['shortSummary'] = 'श्री. शंकर शिंदे ने कंपनी के विपणन सहायता के माध्यम से अपना प्याज नाफेड को बेचा, जिससे उन्हें बेहतर दर और सीधे बैंक भुगतान प्राप्त हुआ।'
    hi_story['fullStory'] = 'रबी २०२३-२४ और खरीफ २०२३-२४ मौसम के दौरान, श्री. शंकर शिंदे ने कंपनी के विपणन सहायता के माध्यम से अपना प्याज नाफेड को बेचा।\n\nइस माध्यम से बेचने पर उन्हें बाजार भाव की तुलना में प्रति क्विंटल १०० से ५०० रुपये अधिक दाम मिला। भुगतान सीधे उनके बैंक खाते में किया गया, जिससे पारदर्शी और विश्वसनीय लेन-देन सुनिश्चित हुआ।\n\nबेहतर दाम मिलने के परिणामस्वरूप, श्री. शिंदे को पारंपरिक बाजार में बेचने की तुलना में प्रति ट्रैक्टर ट्रॉली कम से कम ५,००० रुपये की अतिरिक्त आय प्राप्त हुई।\n\nउनके अनुभव के आधार पर, नाफेड को बिक्री की सुविधा में कंपनी के समर्थन ने उन्हें बेहतर बाजार मूल्य प्राप्त करने, सुरक्षित भुगतान प्राप्त करने और उनके प्याज खेती व्यवसाय की समग्र लाभप्रदता में सुधार करने में मदद की।'
    hi_story['challenge'] = 'पारंपरिक बाजार के माध्यम से प्याज बेचने पर अक्सर कम बाजार दर और अप्रत्याशित भुगतान चक्र का सामना करना पड़ता है।'
    hi_story['solution'] = 'ग्रीन विंग्स ने रबी २०२३-२४ और खरीफ २०२३-२४ मौसम के दौरान श्री. शिंदे के प्याज को सीधे नाफेड को बेचने की सुविधा प्रदान की।'
    hi_story['result'] = 'बाजार दर की तुलना में प्रति क्विंटल १०० से ५०० रुपये अधिक मूल्य प्राप्त किया और पारदर्शी, सीधे बैंक भुगतान सुनिश्चित किया।'
    hi_story['priceBenefit'] = 'प्रति क्विंटल १०० से ५०० रुपये अधिक मूल्य'
    hi_story['additionalIncome'] = 'प्रति ट्रैक्टर ट्रॉली कम से कम ५,००० रुपये की अतिरिक्त आय'
    hi_story['marketSupport'] = 'नाफेड को सीधा विपणन और बिक्री सुविधा'

    # Insert both records
    for story in [mr_story, hi_story]:
        # Check if exists
        cursor.execute("SELECT id FROM success_stories WHERE slug = ? AND language = ?", (story['slug'], story['language']))
        if cursor.fetchone():
            print(f"Story for {story['language']} already exists. Updating...")
            set_clause = ', '.join([f"{k} = ?" for k in story.keys()])
            values = tuple(story.values()) + (story['slug'], story['language'])
            cursor.execute(f"UPDATE success_stories SET {set_clause} WHERE slug = ? AND language = ?", values)
        else:
            print(f"Inserting story for {story['language']}...")
            columns_str = ', '.join(story.keys())
            placeholders = ', '.join(['?'] * len(story))
            values = tuple(story.values())
            cursor.execute(f"INSERT INTO success_stories ({columns_str}) VALUES ({placeholders})", values)
            
    conn.commit()
    conn.close()
    print("Successfully translated Shankar Shinde's success story to MR and HI.")

if __name__ == '__main__':
    main()
