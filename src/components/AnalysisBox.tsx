'use client';
import React, { useEffect, useState } from 'react';

type Props = {
  html: string;
};

export default function AnalysisBox({ html }: Props) {
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    if (!html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.body;

    const headings = Array.from(content.querySelectorAll('h3, h4'));
    const newSections: { title: string; content: string }[] = [];

    for (let i = 0; i < headings.length; i++) {
      const title = headings[i].textContent || '';
      const currentNode = headings[i];
      const nextNode = headings[i + 1];

      const sectionElements: Element[] = [];
      let sibling = currentNode.nextElementSibling;

      while (sibling && sibling !== nextNode) {
        sectionElements.push(sibling);
        sibling = sibling.nextElementSibling;
      }

      const wrapper = document.createElement('div');
      sectionElements.forEach(el => wrapper.appendChild(el.cloneNode(true)));
      newSections.push({ title, content: wrapper.innerHTML });
    }

    setSections(newSections);
  }, [html]);

  return (
  <>
    {sections.map(({ title, content }, idx) => (
      <div className="card training-analysis" key={idx}>
        <h4>{title}</h4>
        <div className="analysis-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    ))}
  </>
);

}
