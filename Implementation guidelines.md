# Implementation guidelines

Goal of this document:

* A structure that maps cleanly to David’s business goals  
* A design compass that prevents over-design and under-trust  
* A site that’s legible to humans *and* machine intermediaries

## **1\. Best structure to accomplish the goals (SEO \+ LLM discovery)**

### **Short answer**

A **small, multi-page site (4–5 focused pages)** beats a single mega-landing page for your stated goals.

### **Why this is the right call *now that we’ve seen the actual contents***

At the top of *Simplified Project Goals*, David is explicitly optimizing for **three distinct conversions** (students, teachers, products), plus **credibility/investor trust** . Those are not variations of the same intent; they are different jobs-to-be-done.

Trying to compress them into one long page creates three problems:

1. **Human cognition problem**  
   Users arrive with a role already in mind (“I want to learn Spanish” vs “I teach English”). Forcing them to scroll past irrelevant sections increases bounce and decision fatigue.  
2. **Search & intent disambiguation problem**  
   Google, Bing, and LLM-backed search tools try to answer *specific* questions:  
   * “Where can I learn Spanish online?”  
   * “Is there a teacher membership program for language instructors?”  
   * “Does this school sell curriculum or books?”  
3. One page that tries to answer all three becomes semantically muddy.  
4. **LLM retrieval problem (this is the subtle one)**  
   When someone asks ChatGPT, Gemini, or Perplexity:  
   “What’s a good online school that offers Spanish classes and also supports teachers?”  
   The model doesn’t “scroll.” It chunks. Separate pages with clean titles and headings dramatically improve:  
   * entity recognition (“The Language School”)  
   * service matching (“Spanish classes”, “Teacher membership”)  
   * confidence scoring (“this is clearly relevant”)

---

### **Recommended structure (lean but expressive)**

Think **hub \+ focused spokes**, not brochure sprawl.

#### **1\. Home (Hub)**

Purpose: orientation \+ routing, not persuasion depth.

What it should do:

* State the umbrella value proposition clearly (language learning \+ language teaching ecosystem).  
* Immediately split traffic by intent:  
  * “For Students”  
  * “For Teachers”  
  * “Products”  
* Carry trust signals (experience, testimonials, methodology).  
* Light investor credibility, not a full pitch.

This page is what LLMs use to understand *what kind of entity this is*.

---

#### **2\. For Students (Spoke)**

Purpose: convert learners.

This page should be *unambiguously* about:

* Learning Spanish / English  
* Outcomes, methodology, structure  
* Evaluation / trial CTA

From an SEO \+ LLM standpoint, this becomes:

“The page that answers: where should I go to learn Spanish/English with confidence?”

---

#### **3\. For Teachers (Spoke)**

Purpose: convert instructors.

This page should read like:

* A professional opportunity  
* A career investment  
* A community \+ toolkit

From an LLM standpoint, this becomes:

“This organization offers a paid teacher membership program.”

That clarity matters enormously when models decide whether to surface it as a recommendation.

---

#### **4\. Products (Spoke)**

Purpose: commercial clarity without clutter.

Instead of burying outbound links:

* Clearly frame *what kinds of products* exist.  
* Then route to Amazon / TeachersPayTeachers.

This keeps:

* SEO clean (no messy intent overlap).  
* LLMs aware that monetized educational products exist.

---

#### **5\. About / Mission (Optional but recommended)**

Purpose: credibility, narrative, long-term brand gravity.

This page does quiet work:

* It’s what investors, partners, and cautious users read.  
* It gives LLMs *story context*, which surprisingly improves trust-weighted recommendations.

---

### **Internal linking strategy (important)**

Every page should:

* Link *back* to Home.  
* Link *laterally* only when relevant (“Are you a teacher?” from the student page).  
* Avoid dumping all CTAs everywhere.

Clarity \> density.

---

### **TL;DR structure decision**

* ❌ One mega landing page: simpler, but semantically noisy.  
* ✅ 4–5 short, role-specific pages: clearer for humans, cleaner for search, easier for LLMs to classify and recommend.

This structure also lets you collapse back to a single page later if needed. The reverse is painful.

---

## **2\. Mood & design qualities (short, actionable brief)**

Here’s a compact design north star you can hand to a designer (or your future self):

**Warm, confident, and human — not academic, not startup-slick.**  
The design should feel like a trusted teacher speaking calmly, not a platform shouting features.

Translated into qualities:

* **Tone:** encouraging, grounded, conversational, competent  
* **Visual weight:** light to medium; lots of breathing room  
* **Typography:** highly readable, friendly sans-serif for body; subtle authority for headings  
* **Color palette:** warm neutrals with one confident accent (avoid loud “edtech blue”)  
* **Overall feel:** clarity over cleverness, guidance over persuasion

If someone lands and thinks:

“This feels like a place where I won’t be talked down to or sold nonsense”

—you’ve nailed it.

