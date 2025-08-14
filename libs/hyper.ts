/** @jsx h */
// ^^^^ this tells a transpiler to inject calls to an `h()` function for each node.

type VirtualNode = {
  nodeName: string;
  attributes: Record<string, string>;
  children: (string | VirtualNode)[];
};

export function h(
  nodeName: string | Function,
  attributes: Record<string, string>,
  ...args: (string | VirtualNode)[]
) {
  if (typeof nodeName === "function") {
    return nodeName();
  }

  let children = args.length ? [...args] : null;
  return { nodeName, attributes, children };
}

export function render(vnode: VirtualNode | string) {
  // If string, insert text in page.
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // Create DOM element from VNode
  const n = document.createElement(vnode.nodeName);
  let a = vnode.attributes || {};
  Object.entries(a)
    .filter(([name]) => !name.startsWith("__"))
    .forEach(([name, value]) => n.setAttribute(name, value));

  (vnode.children || []).forEach((c) => n.appendChild(render(c)));

  return n;
}
