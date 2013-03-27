using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Orchard.Localization;

namespace Mello.ImageGallery.Extensions
{
  public static class LabelForExtensions
  {
    public static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, LocalizedString labelText, object htmlAttributes)
    {
      return LabelFor(html, expression, labelText.ToString(), new RouteValueDictionary(htmlAttributes));
    }

    public static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string labelText, object htmlAttributes)
    {
        return LabelFor(html, expression, labelText, new RouteValueDictionary(htmlAttributes));
    }

    public static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string labelText, IDictionary<string, object> htmlAttributes)
    {
        ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, html.ViewData);
        string htmlFieldName = ExpressionHelper.GetExpressionText(expression);

        TagBuilder tag = new TagBuilder("label");
        tag.MergeAttributes(htmlAttributes);
        tag.Attributes.Add("for", html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldId(htmlFieldName));
        tag.SetInnerText(labelText);
        return MvcHtmlString.Create(tag.ToString(TagRenderMode.Normal));
    }
  }
}