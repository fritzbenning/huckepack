export const getTitle = (attribute: string, isComponent: boolean) => {
  if (isComponent) {
    return attribute;
  }

  const nameMap: Record<string, string> = {
    p: "Text",
    h1: "H1 Headline",
    h2: "H2 Headline",
    h3: "H3 Headline",
    h4: "H4 Headline",
    h5: "H5 Headline",
    h6: "H6 Headline",
    a: "Link",
    img: "Image",
    header: "Header",
    section: "Section",
    footer: "Footer",
    div: "Container",
    span: "Span",
    button: "Button",
    input: "Input",
    form: "Form",
    nav: "Navigation",
    main: "Main",
    article: "Article",
    aside: "Aside",
    ul: "List",
    ol: "Ordered List",
    li: "List Item",
    table: "Table",
    tr: "Table Row",
    td: "Table Cell",
    th: "Table Header",
    thead: "Table Head",
    tbody: "Table Body",
    tfoot: "Table Footer",
  };

  return nameMap[attribute] || attribute;
};
