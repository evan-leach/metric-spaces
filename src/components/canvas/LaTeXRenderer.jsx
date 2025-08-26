import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { textColors } from '../../config/colors';

// Simple LaTeX component for direct rendering
export const LaTeXMath = ({ math, block = false }) => {
  try {
    return block ? (
      <BlockMath math={math} />
    ) : (
      <InlineMath math={math} />
    );
  } catch (error) {
    return (
      <span style={{ color: 'red' }}>
        LaTeX Error: {error.message}
      </span>
    );
  }
};

// Direct KaTeX renderer for your existing text overlay system
export const TextOverlayLaTeX = ({ content }) => {
  // Split content by LaTeX delimiters and render appropriately
  const renderMixedContent = (text) => {
    // Handle block math ($$...$$)
    const blockMathRegex = /\$\$(.*?)\$\$/gs;
    // Capture inline math and any immediately following punctuation
    const inlineMathRegex = /\$(.*?)\$([,.;:!?]?)/g;
    
    let parts = [];
    let lastIndex = 0;
    let match;
    
    // First handle block math
    while ((match = blockMathRegex.exec(text)) !== null) {
      // Add text before the math
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push({ type: 'text', content: beforeText });
      }
      
      // Add the block math
      parts.push({ type: 'blockMath', content: match[1].trim() });
      lastIndex = blockMathRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }
    
    // Now handle inline math in text parts
    const finalParts = [];
    parts.forEach(part => {
      if (part.type === 'text') {
        const textParts = [];
        let textLastIndex = 0;
        let inlineMatch;
        
        while ((inlineMatch = inlineMathRegex.exec(part.content)) !== null) {
          // Add text before inline math
          if (inlineMatch.index > textLastIndex) {
            textParts.push({
              type: 'text',
              content: part.content.slice(textLastIndex, inlineMatch.index)
            });
          }
          
          // Add inline math with any following punctuation
          textParts.push({
            type: 'inlineMath',
            content: inlineMatch[1].trim(),
            punctuation: inlineMatch[2] || '' // Capture following punctuation
          });
          textLastIndex = inlineMathRegex.lastIndex;
        }
        
        // Add remaining text
        if (textLastIndex < part.content.length) {
          textParts.push({
            type: 'text',
            content: part.content.slice(textLastIndex)
          });
        }
        
        finalParts.push(...textParts);
      } else {
        finalParts.push(part);
      }
    });
    
    return finalParts;
  };
  
  // Process markdown bold and italic in text content
  const processMarkdown = (text) => {
    // Handle both bold (*text*) and italic (_text_)
    const boldRegex = /\*(.*?)\*/g;
    const italicRegex = /_(.*?)_/g;
    
    // First pass: handle bold
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add bold
      parts.push({
        type: 'bold',
        content: match[1]
      });
      lastIndex = boldRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }
    
    // Second pass: handle italic in text parts
    const finalParts = [];
    parts.forEach(part => {
      if (part.type === 'text') {
        const textParts = [];
        let textLastIndex = 0;
        let italicMatch;
        
        while ((italicMatch = italicRegex.exec(part.content)) !== null) {
          // Add text before italic
          if (italicMatch.index > textLastIndex) {
            textParts.push({
              type: 'text',
              content: part.content.slice(textLastIndex, italicMatch.index)
            });
          }
          
          // Add italic
          textParts.push({
            type: 'italic',
            content: italicMatch[1]
          });
          textLastIndex = italicRegex.lastIndex;
        }
        
        // Add remaining text
        if (textLastIndex < part.content.length) {
          textParts.push({
            type: 'text',
            content: part.content.slice(textLastIndex)
          });
        }
        
        finalParts.push(...textParts);
      } else {
        finalParts.push(part);
      }
    });
    
    return finalParts.length > 0 ? finalParts : [{ type: 'text', content: text }];
  };
  
  const parts = renderMixedContent(content);
  
  return (
    <div>
      {parts.map((part, index) => {
        switch (part.type) {
          case 'blockMath':
            return <LaTeXMath key={index} math={part.content} block={true} />;
          case 'inlineMath':
            return (
              <span key={index} style={{ whiteSpace: 'nowrap' }}>
                <LaTeXMath math={part.content} block={false} />
                {part.punctuation}
              </span>
            );
          case 'text':
            // Process markdown in text content
            const markdownParts = processMarkdown(part.content);
            return (
              <span key={index}>
                {markdownParts.map((mdPart, mdIndex) => {
                  switch (mdPart.type) {
                    case 'bold':
                      return <strong key={mdIndex} style={{color: textColors.bold}}>{mdPart.content}</strong>;
                    case 'italic':
                      return <em key={mdIndex} style={{color: textColors.italic}}>{mdPart.content}</em>;
                    case 'text':
                      return <span key={mdIndex}>{mdPart.content}</span>;
                    default:
                      return null;
                  }
                })}
              </span>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default LaTeXMath; 