from typing import Dict, Any, List, Optional
import logging
from groq import AsyncGroq
import json


class ProductDescriptionService:
    """
    Service for generating AI-powered product descriptions
    """
    
    def __init__(self):
        self.client = AsyncGroq(api_key="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")
        self.logger = logging.getLogger(__name__)
        
        # Define different prompt templates for various tones
        self.prompt_templates = {
            "professional": {
                "system_prompt": "You are a professional product description writer. Write formal, detailed, and informative descriptions that highlight technical specifications and professional features. Use industry-standard terminology and focus on features, benefits, and technical advantages.",
                "title_instruction": "Create a professional, SEO-friendly product title that clearly identifies the product, brand, and key feature.",
                "short_description_instruction": "Write a concise, 1-2 sentence summary highlighting the product's primary benefit and key specification.",
                "full_description_instruction": "Write a detailed, multi-paragraph description covering the product's features, technical specifications, benefits, and use cases. Structure it professionally with clear paragraphs.",
                "highlights_instruction": "Create 3-5 key selling points focusing on technical advantages, professional features, and performance benefits."
            },
            "casual": {
                "system_prompt": "You are a friendly and approachable product description writer. Write conversational, engaging, and relatable descriptions that make the product feel accessible and desirable. Use warm, inviting language that connects with customers.",
                "title_instruction": "Create an engaging, SEO-friendly product title that feels approachable and appealing.",
                "short_description_instruction": "Write a friendly, inviting 1-2 sentence summary that makes the product feel appealing and desirable.",
                "short_description_instruction": "Write a friendly, inviting 1-2 sentence summary that makes the product feel appealing and desirable.",
                "full_description_instruction": "Write a warm, detailed description explaining how this product can improve the customer's life. Include personal benefits, lifestyle aspects, and reasons why someone would want this product.",
                "highlights_instruction": "Create 3-5 appealing points that make this product desirable, focusing on lifestyle benefits and personal value."
            },
            "sales": {
                "system_prompt": "You are a compelling sales copywriter. Write persuasive descriptions that highlight value, discounts, urgency, and reasons to buy now. Focus on promotional language, benefits, and calls to action.",
                "title_instruction": "Create a compelling, SEO-friendly product title that emphasizes value and urgency.",
                "short_description_instruction": "Write a promotional 1-2 sentence summary that highlights value, urgency, or special offers.",
                "full_description_instruction": "Write a persuasive, sales-focused description highlighting benefits, value, special features, and reasons to purchase immediately. Include any urgency or scarcity elements if relevant.",
                "highlights_instruction": "Create 3-5 compelling selling points that emphasize value, benefits, and reasons to buy now."
            },
            "minimal": {
                "system_prompt": "You are an elegant, minimalist product description writer. Write concise, refined descriptions that focus on essential features and quality. Use sophisticated, simple language that implies luxury and refinement.",
                "title_instruction": "Create an elegant, minimal product title that suggests quality and refinement.",
                "short_description_instruction": "Write a concise, refined 1-2 sentence summary that conveys quality and essence.",
                "full_description_instruction": "Write a refined, minimalist description focusing on essential features, quality craftsmanship, and premium aspects. Avoid fluff and focus on substance.",
                "highlights_instruction": "Create 3-5 refined points that emphasize quality, craftsmanship, and essential features."
            }
        }
    
    async def generate_description(self, 
                                  product_data: Dict[str, Any], 
                                  tone: str = "professional") -> Dict[str, Any]:
        """
        Generate a complete product description using AI
        
        Args:
            product_data: Dictionary containing product information
            tone: The tone to use for the description (professional, casual, sales, minimal)
            
        Returns:
            Dictionary with generated product descriptions
        """
        try:
            if tone not in self.prompt_templates:
                tone = "professional"  # Default to professional
            
            template = self.prompt_templates[tone]
            
            # Build the product context for the AI
            product_context = self._build_product_context(product_data)
            
            # Generate each part of the description
            title = await self._generate_title(product_data, template)
            short_description = await self._generate_short_description(product_context, template)
            full_description = await self._generate_full_description(product_context, template)
            highlights = await self._generate_highlights(product_context, template)
            keywords = await self._generate_keywords(product_context, title, short_description)
            meta_description = await self._generate_meta_description(short_description)
            
            return {
                "title": title,
                "short_description": short_description,
                "full_description": full_description,
                "highlights": highlights,
                "keywords": keywords,
                "meta_description": meta_description,
                "tone": tone
            }
            
        except Exception as e:
            self.logger.error(f"Error generating product description: {str(e)}", exc_info=True)
            # Return a default response in case of error
            return {
                "title": product_data.get("name", "Untitled Product"),
                "short_description": "توضیحات کوتاه محصول",
                "full_description": "توضیحات کامل محصول در اینجا قرار می‌گیرد.",
                "highlights": ["ویژگی 1", "ویژگی 2", "ویژگی 3"],
                "keywords": ["keyword1", "keyword2", "keyword3"],
                "meta_description": "متا توضیحات محصول",
                "tone": tone
            }
    
    def _build_product_context(self, product_data: Dict[str, Any]) -> str:
        """
        Build a context string from product data for the AI
        """
        context_parts = []
        
        if product_data.get("name"):
            context_parts.append(f"Product Name: {product_data['name']}")
        
        if product_data.get("brand"):
            context_parts.append(f"Brand: {product_data['brand']}")
        
        if product_data.get("category"):
            context_parts.append(f"Category: {product_data['category']}")
        
        if product_data.get("specs"):
            context_parts.append(f"Specifications: {json.dumps(product_data['specs'], ensure_ascii=False, indent=2)}")
        
        if product_data.get("price"):
            context_parts.append(f"Price: {product_data['price']}")
        
        return "\n".join(context_parts)
    
    async def _generate_title(self, product_data: Dict[str, Any], template: Dict[str, str]) -> str:
        """
        Generate a product title using AI
        """
        try:
            prompt = f"""
            {template['system_prompt']}
            
            {template['title_instruction']}
            
            Product Information:
            {self._build_product_context(product_data)}
            
            Generate only the product title, nothing else.
            """
            
            response = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": template['system_prompt']
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                max_tokens=100,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"Error generating title: {str(e)}", exc_info=True)
            return product_data.get("name", "Untitled Product")
    
    async def _generate_short_description(self, product_context: str, template: Dict[str, str]) -> str:
        """
        Generate a short product description using AI
        """
        try:
            prompt = f"""
            {template['system_prompt']}
            
            {template['short_description_instruction']}
            
            Product Information:
            {product_context}
            
            Generate only the short description, nothing else. Maximum 2 sentences.
            """
            
            response = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": template['system_prompt']
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"Error generating short description: {str(e)}", exc_info=True)
            return "توضیحات کوتاه محصول"
    
    async def _generate_full_description(self, product_context: str, template: Dict[str, str]) -> str:
        """
        Generate a full product description using AI
        """
        try:
            prompt = f"""
            {template['system_prompt']}
            
            {template['full_description_instruction']}
            
            Product Information:
            {product_context}
            
            Generate only the full product description, nothing else. Write 3-6 paragraphs with appropriate detail and structure.
            """
            
            response = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": template['system_prompt']
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"Error generating full description: {str(e)}", exc_info=True)
            return "توضیحات کامل محصول در اینجا قرار می‌گیرد."
    
    async def _generate_highlights(self, product_context: str, template: Dict[str, str]) -> List[str]:
        """
        Generate product highlights using AI
        """
        try:
            prompt = f"""
            {template['system_prompt']}
            
            {template['highlights_instruction']}
            
            Product Information:
            {product_context}
            
            Generate only 3-5 key highlights as bullet points. Format each highlight on a new line, without bullet symbols.
            """
            
            response = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": template['system_prompt']
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                max_tokens=300,
                temperature=0.7
            )
            
            highlights_text = response.choices[0].message.content.strip()
            # Split by new lines to create the list
            highlights = [highlight.strip() for highlight in highlights_text.split('\n') if highlight.strip()]
            
            # Limit to 5 highlights
            return highlights[:5]
        except Exception as e:
            self.logger.error(f"Error generating highlights: {str(e)}", exc_info=True)
            return ["ویژگی 1", "ویژگی 2", "ویژگی 3"]
    
    async def _generate_keywords(self, product_context: str, title: str, short_desc: str) -> List[str]:
        """
        Generate SEO keywords for the product
        """
        try:
            prompt = f"""
            You are an SEO expert. Generate 5-10 relevant keywords for this product.
            
            Product Information:
            {product_context}
            
            Title: {title}
            Short Description: {short_desc}
            
            Provide only the keywords, separated by new lines. No explanations.
            """
            
            response = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an SEO expert. Generate 5-10 relevant keywords for this product."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                max_tokens=200,
                temperature=0.6
            )
            
            keywords_text = response.choices[0].message.content.strip()
            # Split by new lines to create the list
            keywords = [keyword.strip() for keyword in keywords_text.split('\n') if keyword.strip()]
            
            # Limit to 10 keywords
            return keywords[:10]
        except Exception as e:
            self.logger.error(f"Error generating keywords: {str(e)}", exc_info=True)
            return ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    
    async def _generate_meta_description(self, short_description: str) -> str:
        """
        Generate a meta description for SEO
        """
        try:
            # Meta descriptions should be under 160 characters
            if len(short_description) > 150:
                return short_description[:150] + "..."
            return short_description
        except Exception as e:
            self.logger.error(f"Error generating meta description: {str(e)}", exc_info=True)
            return "متا توضیحات محصول"