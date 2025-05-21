# Setting Up Your Contact Form with Formspree

This portfolio website uses [Formspree](https://formspree.io) to handle form submissions without requiring backend code.

## Setup Instructions

1. **Create a Formspree Account**:
   - Go to [Formspree.io](https://formspree.io)
   - Sign up for an account (the free tier allows 50 submissions per month)

2. **Create a New Form**:
   - After logging in, click on "New Form"
   - Give your form a name (e.g., "Portfolio Contact Form")
   - Choose the email address where you want to receive form submissions

3. **Get Your Form ID**:
   - After creating the form, you'll see a form endpoint URL that looks like this:
     `https://formspree.io/f/xxxxxxxx`
   - The part after "/f/" is your form ID (xxxxxxxx)

4. **Update Your HTML**:
   - Open `index.html` in your portfolio
   - Find the contact form section (search for `<form id="contactForm"`)
   - Replace "your-formspree-id" in the action attribute with your actual form ID:
     ```html
     <form id="contactForm" action="https://formspree.io/f/your-actual-id" method="POST">
     ```

5. **Test Your Form**:
   - Open your portfolio website
   - Fill out and submit the contact form
   - You should receive the submission in your email
   - The form should show a success message when successfully submitted

## Customizing Form Behavior

The form is already set up to:
- Show loading, success, and error messages
- Reset after successful submission
- Work with AJAX (no page refresh)

If you need to make additional customizations, you can modify:
- The `initContactForm` function in `js/optimized-main.js`
- The form status styles in `css/modern-styles.css`

## Troubleshooting

If your form is not working:
1. Check that you've entered the correct form ID
2. Ensure your Formspree account is active
3. Check for any JavaScript console errors
4. Try submitting with a different email address (to rule out spam filtering issues)

For more help, visit [Formspree's documentation](https://formspree.io/docs/)
