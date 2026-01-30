kimi-env: sk-9VCpJUcwEAAvatwWiiEPGpslo0X7x8d535NzCpBtSh4hkC3n

## Specifications of Project:
- Web design builder 
- Uses AI models from google-gemini or moonshot-kimi-k2.5
- Allow model switching in the chat box
- Prompt builder that allows selection of templates and injects prompts into the prompt-box w/ details on how to create the specific design the user selects
- For the first version of the app we're only limiting to landing page designs
- So the prompt builder selection menus will only include layouts for landing page types

## User Flow:

- Page Loads with a chat box in the center with model switching and a button that opens the prompt builder like in the video
- User selects buttons to add prompts to the prompt box
- User clicks send and view switches to 30/70 - chat window and preview
- User can now switch between models and design/edit mode in chat box
-


## Prompt Builder (for proof-of-concept):
- Only limited to landing pages -> top-most option is landing page
- After top-option is selected few more options open up allowing users to select different layout of landing pages:
 	- Left Text, Right Image/View
	- Opposite of above
	- Center Text and CTA w/o any image
	
- Navbar selection
	- Top Navbar
	- Bottom Floating Navbar
- Font Styles Selection
	- Any 3 basic ones
- Color mode selection 
	- Dark/Light Mode (only allow one for now)
		- Basic Accent colors depending on the color selection mode
- Animation Style
	- Type
		- Fade
		- Slide
    - Duration
        - Slider w/ limits that make it so that the animations are either premium or normal
    - Delay
        - Slider w/ limits that make it so that the animations are either premium or normal
    - Scene: Describes how each element animates into view 
        - All at once
        - Staggered
        - Word by Word
    - Timing: 
        - Take options from the video
    - Direction
        - Take options from the video

# Chat Box:
## Before 1st prompt:

- Text area
- Model Switching
- Prompt Builder Button
- Send button
## After 1st prompt:

- 30% of the screen occupied
    - No Prompt Builder Button
    - Model switching
    - Mode switchin
        - Edit
        - Design

# Top Bar 

- Cover whole of the top of the screen of chat and preview window like the video
- Chat box side: 
    - Back button
- Preview Side
    - To switch between mobile and desktop view
    - Switch between preview, design and code view
    - Button to export code
    - Buttons to change fonts and colors and animations at the top that open up menus like in the video

# Preview Window

- In preview mode the user should just be able to view the page like a visitor
- In design mode the user should be able to hover over the elements of the page and see their unique tags the model has coded into the page and on double clicking the elements it adds the element tag into the chatbox and switches the chat mode to edit 
- In code mode the user should be able to view the code of the page

# Chat Modes:

## Edit Mode:

- Changes model instructions to only edit the code already written
- The code already written will be sent to the model on every edit mode call for clear context while also saving it's copy

## Design Mode:

- Changes model instructions to only design everything from scratch by taking the first prompt the user has entered and the current prompt the user sends


# Top bar injections:
- Top bar has buttons to switch fonts, animations, & colors
- When user hovers over the buttons it opens up a menu like in the video
- The user can then select the individual predefined options to change the fonts, animations, or colors of the page 
- On clicking the buttons it should inject the code for the selected font, animation, or color into the code the model has written and instantly reload the html view to show the changes 

# Final Instructions:
- Do not make any assumptions
- Plan before making changes to existing code or creating new ones
- View the video first to understand implementations





