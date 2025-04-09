var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { Schema } from '@formily/json-schema';
import { clone, uid } from '@designable/shared';
var createOptions = function (options) {
  return __assign({ designableFieldName: 'Field', designableFormName: 'Schema' }, options);
};
var findNode = function (node, finder) {
  if (!node) return;
  if (finder(node)) return node;
  if (!node.children) return;
  for (var i = 0; i < node.children.length; i++) {
    if (findNode(node.children[i])) return node.children[i];
  }
  return;
};
export var transformToSchema = function (node, options) {
  var realOptions = createOptions(options);
  var root = findNode(node, function (child) {
    return child.componentName === realOptions.designableFormName;
  });
  var schema = {
    type: 'Schema',
  };
  if (!root) return { schema: schema };
  var createSchema = function (node, schema) {
    console.info('createSchema', node);
    if (schema === void 0) {
      schema = {};
    }
    schema['type'] = node.componentName;
    // schema['comtype'] = node.componentName;
    schema['params'] = clone(node.props);
    schema['x-designable-id'] = node.id;
    node.children.forEach(function (child) {
      console.log(child);

      var key = child.props.key || child.id;
      schema.children = schema.children || {};
      schema.children[key] = createSchema(child);
    });
    return schema;
  };
  return createSchema(root, schema);
};

export var transformToTreeNode = function (schema, options) {
  console.info('transformToTreeNode', schema);
  //判空
  if (schema === void 0) {
    schema = {};
  }
  var realOptions = createOptions(options);
  //父节点
  var root = {
    componentName: realOptions.designableFormName,
    props: schema.params,
    children: [],
  };
  //渲染子节点方法
  var appendTreeNode = function (parent, schema) {
    if (!schema) return;
    var current = {
      id: schema['x-designable-id'] || uid(),
      componentName: schema.type,
      props: schema.params,
      children: [],
    };
    //把节点添加到父上
    parent.children.push(current);
    if (schema.children === void 0) return
    //判断是否有字节点，有则继续添加
    Object.keys(schema.children).map(function (key) {
      appendTreeNode(current, schema.children[key]);
    });
  };
  //对sechma的properties遍历，渲染节点到
  if (schema.children === void 0) return root
  Object.keys(schema.children).map(function (key) {
    appendTreeNode(root, schema.children[key]);
  });
  return root;
};
