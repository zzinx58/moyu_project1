//Without routes icon.（No resource)
type IconName = string;
type IconUrl = string;
export interface SiteRoutesType {
  menuList: SiteRouteItemType[];
  [key: string]: SiteRouteItemType | SiteRouteItemType[];
}
export interface SiteRouteItemType {
  // path: string;
  label: string;
  iconMeta?: IconName | IconUrl;
  childrens?: SiteRouteItemType[];
  [key: string]: any;
}

export const SiteRouteMap: SiteRoutesType = {
  menuList: [
    {
      label: "总览",
      iconMeta: "i-custom-svg:overview",
      to: "/index_preview",
    },
    {
      label: "赛事管理",
      iconMeta: "i-custom-svg:tournaments",
      // to: '/tournaments',
      to: "/t_list",
    },
    {
      label: "学员管理",
      iconMeta: "i-custom-svg:students",
      // to: '/students',
      // to: "/svg_preview",
    },
    {
      label: "战队管理",
      iconMeta: "i-custom-svg:teams",
      // to: '/teams',
      // to: "/test",
    },
    {
      label: "商城管理",
      iconMeta: "i-custom-svg:marketplace",
      // to: '/marketplace',
    },
    {
      label: "用户数据",
      iconMeta: "i-custom-svg:user-data",
      to: "/users_list",
    },
    {
      label: "APP管理",
      iconMeta: "i-custom-svg:user-data",
      // to: "/users_list",
    },
  ],
};
