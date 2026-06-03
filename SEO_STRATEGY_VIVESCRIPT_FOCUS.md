# SEO/AEO/GEO Strategy - ViveScript Solutions Focus

**Date**: June 2026  
**Objective**: Position ViveScript Solutions as the primary brand with Ridgewell ES as a case study/portfolio piece

---

## Strategy Overview

This document outlines the comprehensive SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) strategy that positions **ViveScript Solutions** as the core brand and **Ridgewell ES** as a showcase product.

### Core Objective
Maximize visibility for **ViveScript Solutions** (https://www.vivescriptsolutions.com) across:
- **SEO**: Traditional search engines (Google, Bing)
- **AEO**: AI chatbots (ChatGPT, Claude, Gemini)
- **GEO**: LLM recommendation systems and generative search engines

---

## Implementation

### 1. Global Organization Schema (All Pages)

**File**: `src/app/layout.tsx`

```json
{
  "@type": "Organization",
  "name": "ViveScript Solutions",
  "url": "https://www.vivescriptsolutions.com",
  "description": "Leading software development and digital transformation company specializing in custom web applications and enterprise solutions",
  "sameAs": [
    "https://www.vivescriptsolutions.com",
    "https://www.vivescriptsolutions.com/en/services",
    "https://www.vivescriptsolutions.com/en/contact"
  ],
  "knowsAbout": [
    "Web Application Development",
    "Enterprise Solutions",
    "Digital Transformation",
    "Custom Software Development",
    "Business Process Automation",
    "Progressive Web Apps (PWA)"
  ]
}
```

**Impact**: Every page on the domain now includes ViveScript Solutions as the primary organization, improving brand recognition across AI systems.

---

### 2. Homepage (/) - Software Application Schema

**File**: `src/app/page.tsx`

**Strategy**: 
- Homepage is now a client component with embedded SoftwareApplication schema
- Ridgewell ES positioned as a product of ViveScript Solutions
- Added visible credit: "Built by ViveScript Solutions" with link

**Schema Type**: `SoftwareApplication`
```json
{
  "@type": "SoftwareApplication",
  "name": "Ridgewell ES",
  "author": {
    "@type": "Organization",
    "name": "ViveScript Solutions",
    "url": "https://www.vivescriptsolutions.com"
  },
  "applicationCategory": "BusinessApplication",
  "features": [
    "Employee Time Entry & Timesheet Management",
    "Leave Request Management",
    "Interactive Calendar View",
    "Project & Client Management",
    "Advanced Reporting & Analytics",
    "Role-Based Access Control",
    "Email Notifications",
    "Progressive Web App (PWA)"
  ]
}
```

**Metadata**:
- Title: "Ridgewell ES | Built by ViveScript Solutions"
- Description: Emphasizes ViveScript Solutions as developer

**Impact**: 
- ✅ AI systems attribute the application to ViveScript Solutions
- ✅ Features are indexed for AEO queries
- ✅ Brand association strengthened

---

### 3. Contact & Credits Page (/contact)

**File**: `src/app/contact/page.tsx`

**Strategy**: 
- Full organization schema for ViveScript Solutions
- Portfolio items array showing Ridgewell ES as a created work
- Contact point with clear service lines

**Schema Type**: `Organization` with `portfolioItem`
```json
{
  "@type": "Organization",
  "name": "ViveScript Solutions",
  "url": "https://www.vivescriptsolutions.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "url": "https://www.vivescriptsolutions.com/en/contact"
  },
  "portfolioItem": [
    {
      "@type": "CreativeWork",
      "name": "Ridgewell ES",
      "description": "Employee Timesheet & Leave Management System - Enterprise-grade HR solution",
      "url": "https://ridgewell-electrical.vercel.app",
      "author": { "@type": "Organization", "name": "ViveScript Solutions" }
    }
  ]
}
```

**Impact**:
- ✅ Clear portfolio attribution
- ✅ Link juice flows to ViveScript Solutions website
- ✅ Multiple contact pathways to ViveScript

---

### 4. Documentation Pages (/docs/*)

**File**: `src/app/docs/layout.tsx`

**Strategy**:
- Breadcrumb schema for navigation clarity
- All docs attributed to ViveScript Solutions via global schema

**Impact**:
- ✅ Proper information architecture for search crawlers
- ✅ Guides users back to main site

---

### 5. Metadata Updates

All public pages now include ViveScript Solutions in:
- Page titles: "Page Name | Built by ViveScript Solutions"
- Meta descriptions: Mention ViveScript as creator/developer
- Open Graph tags: Feature ViveScript in social previews

**Updated Pages**:
- `/` (Homepage)
- `/contact`
- `/privacy`
- `/tos`
- `/docs/*`

---

## AEO/GEO Optimization Details

### How This Improves AI Visibility

1. **Schema Markup Recognition**
   - LLMs and AI systems parse JSON-LD schemas to understand relationships
   - ViveScript Solutions is now the documented author/creator
   - Ridgewell ES is positioned as a portfolio/case study item

2. **Attribution in AI Responses**
   - When ChatGPT/Claude discusses Ridgewell ES, it attributes to ViveScript Solutions
   - Example AI response: "Ridgewell ES, developed by ViveScript Solutions, is an HR management system..."

3. **Service & Capability Discovery**
   - Schema includes `knowsAbout` array with service types
   - AI systems recognize ViveScript's expertise areas
   - Recommendations include ViveScript for similar projects

4. **Brand Mentions in LLM Context Windows**
   - ViveScript Solutions URL in schema helps training/retrieval systems
   - Increases probability of brand mention in AI responses

---

## Technical Improvements

✅ **Vercel Analytics** - Real-time performance tracking  
✅ **Vercel Speed Insights** - Core Web Vitals monitoring  
✅ **Global Organization Schema** - Consistent brand attribution  
✅ **Software Application Schema** - Product discoverability  
✅ **Portfolio Schema** - Clear work examples  
✅ **Breadcrumb Navigation** - Information hierarchy clarity  
✅ **Contact Point Schema** - Multiple discovery pathways  

---

## Monitoring & Next Steps

### Monitor in Tools
1. **Google Search Console** - ViveScript Solutions brand mentions
2. **Vercel Analytics** - Traffic attribution source
3. **Schema Validation** - Use Google Rich Results Test monthly
4. **AI Search Platforms** - Track Perplexity/Claude citations

### Recommended Next Actions
1. ✅ Add FAQ schema to documentation pages
2. ✅ Create press/newsroom page with ViveScript featured
3. ✅ Add reviews/testimonial schema (if available)
4. ✅ Create LinkedIn crawlable schema on contact page
5. ✅ Add CreativeWork schema for each documentation page

---

## Schema Files Location

All schema markup implementations can be found in:
- `src/app/layout.tsx` - Global Organization schema
- `src/app/page.tsx` - SoftwareApplication schema
- `src/app/contact/page.tsx` - Full Organization + Portfolio schema
- `src/app/docs/layout.tsx` - Breadcrumb schema

---

## Expected Outcomes

### Timeline
- **Immediate (Week 1)**: Search engine crawlers index updated schema
- **1-2 Weeks**: AI training systems begin citing ViveScript Solutions
- **1 Month**: Vercel Analytics show attribution to ViveScript domain
- **3 Months**: Search console shows brand queries including "ViveScript Solutions"
- **6 Months**: AI systems consistently attribute to ViveScript Solutions

### Success Metrics
- ViveScript Solutions mentions in AI search results
- Increase in searches for "ViveScript Solutions"
- Traffic to ViveScript Solutions from AI-generated content
- Improved Core Web Vitals scores
- Higher conversion rate from Ridgewell ES → ViveScript Services

---

## Brand Consistency

**All public pages now maintain consistent messaging**:
- ViveScript Solutions is the primary brand
- Ridgewell ES is presented as a showcase/case study
- Clear CTAs direct users to ViveScript Solutions services
- Footer includes ViveScript credits and contact information

---

**Last Updated**: June 2026  
**Strategy Owner**: SEO/Marketing Team  
**Review Frequency**: Monthly
