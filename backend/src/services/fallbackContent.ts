import { GenerateCampaignRequest } from '../types';

export function generateFallbackContent(request: GenerateCampaignRequest): string {
  const { title, description, target_audience, campaign_type, tone = 'professional', length = 'medium' } = request;
  
  const templates = {
    email: {
      short: `Subject: ${title}

Dear ${target_audience},

${description}

Our solution is perfect for you because:
• Tailored specifically for your needs
• Proven results with similar customers
• Easy to get started today

Take action now - limited time offer!

Best regards,
The Team`,
      
      medium: `Subject: ${title} - Exclusive Offer Inside

Hello ${target_audience},

Hope this message finds you well! We're excited to share something special with you.

${description}

Why this matters to you:
• Addresses your specific challenges
• Saves you time and resources
• Proven track record of success
• Easy implementation process

Here's what our customers are saying:
"This solution transformed our approach and delivered incredible results!"

Ready to experience the difference? 

Click here to get started: [Your Link]

Questions? Simply reply to this email - we're here to help!

Best regards,
Your Marketing Team

P.S. This offer is available for a limited time only!`,
      
      long: `Subject: ${title} - Your Success Story Starts Here

Dear ${target_audience},

I hope this email finds you in great spirits and ready for exciting opportunities ahead.

${description}

As someone who understands the unique challenges faced by ${target_audience}, I wanted to personally reach out to share something that could make a real difference in your journey.

Here's why this opportunity is perfect for you:

✓ TAILORED SOLUTION: Specifically designed with ${target_audience} in mind
✓ PROVEN RESULTS: Join hundreds of satisfied customers who've seen remarkable outcomes  
✓ EASY START: Simple implementation process with full support
✓ RISK-FREE: Complete satisfaction guarantee

What makes us different:
• Deep understanding of your industry
• Commitment to your success
• Ongoing support and guidance
• Transparent pricing with no hidden fees

Success Story:
"Since implementing this solution, we've seen a 40% improvement in our key metrics. The team made the entire process seamless and the results speak for themselves!" - Previous Customer

Your Next Steps:
1. Click the link below to learn more
2. Schedule a free consultation
3. Start seeing results within days

[Get Started Now - Button]

Have questions? I'm personally available to discuss how this can work for your specific situation. Simply reply to this email or call [phone number].

Looking forward to being part of your success story!

Warm regards,

[Your Name]
[Your Title]
[Company Name]

P.S. Remember, this exclusive offer is only available until [date]. Don't miss out on this opportunity to transform your results!`
    },
    
    social: {
      short: `🎯 ${title}

${description}

Perfect for ${target_audience}! 

✨ Get started today
🚀 See results fast
💯 Satisfaction guaranteed

#marketing #success #growth`,
      
      medium: `🎯 ${title}

Hey ${target_audience}! 👋

${description}

Why you'll love this:
✅ Quick setup
✅ Proven results  
✅ Perfect for your needs
✅ Amazing support team

Ready to level up? 🚀

👆 Tap the link in bio to get started!

What are you waiting for? Your success story starts today! 💪

#success #marketing #growth #${campaign_type}campaign`,
      
      long: `🎯 ${title}

Hey amazing ${target_audience}! 👋

We see you working hard every day, and we're here to make your journey even better! 

${description}

Here's what makes this special:
🌟 Designed specifically for ${target_audience}
📈 Proven track record of success
⚡ Quick and easy to implement
🤝 Amazing community support
💯 100% satisfaction guarantee

Real talk: We know you have options. But here's why our customers choose us over the competition:

• We actually understand your challenges
• Our support team is legendary (seriously, check the reviews!)
• Results start showing up fast
• We're with you every step of the way

Success Story Alert! 🚨
"This completely changed my game. Within just one week, I was seeing results I never thought possible!" - Happy Customer

Ready to write your own success story? 

👆 Link in bio to get started
📧 DM us with questions
💬 Tag a friend who needs this!

Your future self will thank you for taking action today! 🚀

#successstory #transformation #${campaign_type} #marketing #growth #community`
    },
    
    web: {
      short: `${title}

${description}

Perfect for ${target_audience}

• Quick Setup
• Proven Results
• Full Support

Get Started Today!`,
      
      medium: `${title}

Welcome ${target_audience}!

${description}

Why Choose Us?
✓ Tailored for your specific needs
✓ Proven track record of success
✓ Easy implementation process
✓ Dedicated support team
✓ Risk-free guarantee

Thousands of ${target_audience} have already transformed their results with our solution.

Ready to join them?

[Get Started Now]

Questions? Contact our friendly support team - we're here to help!`,
      
      long: `${title}

Transform Your Results Starting Today

Dear ${target_audience},

${description}

You're in the right place if you're looking for a solution that actually works. We've helped thousands of people just like you achieve remarkable results, and we're excited to do the same for you.

What Makes Us Different?

🎯 LASER-FOCUSED: Built specifically for ${target_audience}
📊 PROVEN RESULTS: Track record of consistent success
⚡ QUICK START: See results in days, not months  
🤝 FULL SUPPORT: Dedicated team to ensure your success
🛡️ RISK-FREE: 100% satisfaction guarantee

The Process is Simple:
1. Sign up in under 2 minutes
2. Follow our step-by-step guidance
3. Start seeing results immediately
4. Scale your success with ongoing support

What Our Customers Say:
"I was skeptical at first, but the results speak for themselves. This solution exceeded all my expectations!" - Sarah M.

"The support team is incredible. They were with me every step of the way." - Mike T.

"Best investment I've made for my business this year!" - Jennifer L.

Special Limited-Time Offer:
For the next 48 hours, we're offering exclusive bonuses worth $500 absolutely free when you get started today.

Ready to Transform Your Results?

[Get Instant Access Now]

Have Questions? 
Our friendly support team is standing by to help. Chat with us now or call [phone number].

Your success is our mission. Let's make it happen together!`
    },
    
    print: {
      short: `${title}

${description}

Designed for ${target_audience}

• Proven Solutions
• Expert Support  
• Guaranteed Results

Call [Phone] or Visit [Website]`,
      
      medium: `${title}

Attention ${target_audience}!

${description}

Why thousands choose us:
✓ Proven track record
✓ Expert support team
✓ Tailored solutions
✓ Satisfaction guaranteed

"This changed everything for us!" - Happy Customer

Don't wait - spaces are limited!

Call Now: [Phone Number]
Visit: [Website]
Email: [Email Address]

Your success starts with one phone call.`,
      
      long: `${title}

The Solution ${target_audience} Have Been Waiting For

${description}

After years of research and development, we're proud to offer a solution that actually delivers results for ${target_audience}.

Here's What You Get:
• Comprehensive solution tailored for your needs
• Step-by-step implementation guide
• Dedicated support throughout your journey
• 100% satisfaction guarantee
• Exclusive bonuses for early adopters

Success Stories:
"Within just one month, we saw a complete transformation. The team's expertise and support made all the difference." - Company XYZ

"I wish I had found this solution years ago. It would have saved me so much time and frustration!" - Individual Customer

Limited Time Opportunity:
We're only accepting a limited number of new clients this quarter to ensure we can provide the high-quality service you deserve.

Three Ways to Get Started:
📞 Call us at [Phone Number]
🌐 Visit our website at [Website]
✉️ Email us at [Email Address]

Don't let another day pass wondering "what if." Your success story starts with taking action today.

Contact us now - your future self will thank you!

[Company Name] - Transforming Results Since [Year]`
    }
  };
  
  const campaignTemplate = templates[campaign_type as keyof typeof templates];
  if (!campaignTemplate) {
    return `Campaign: ${title}\n\n${description}\n\nTarget Audience: ${target_audience}\n\nThis is a sample campaign content. For AI-generated content, please configure your OpenAI API key.`;
  }
  
  return campaignTemplate[length as keyof typeof campaignTemplate] || campaignTemplate.medium;
}
