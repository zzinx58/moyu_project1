export interface TextOptionsType {
  fontSize: number;
  fontFamily: string;
  //斜体 italic 等
  fontStyle: string;
  //粗体 bold 等
  fontWeight: string;
  //condensed 压缩；expanded 扩展
  fontStretch: string;
  lineHeight: string;
}

// 需要换行的宽度
// export function getTextArrMaxWidth():number
// export function getTextArrMaxWidth(textArr: string[], fontStyle: Partial<TextOptionsType>):number {
//   const canvas = document.createElement('canvas');
//   const canvas2DContext = canvas.getContext('2d') as CanvasRenderingContext2D;
//   function getTextFontStyle() {}
//   function getTextWidth(): number {
//     return;
//   }
//   let textMaxWidth = 0;
//   if (textArr.length > 0) {
//     textArr.forEach((item) => {
//       const itemWidth = getTextWidth();
//       textMaxWidth = Math.max(itemWidth, textMaxWidth);
//     });
//   }
//   return 0
// }

// function renameKeys(obj: any, prefix: any) {
//   const newObj = {} as { [key: string]: any };
//   for (const key in obj) {
//     if (key.startsWith(prefix)) {
//       const newKey = key.substring(prefix.length);
//       newObj[newKey] = obj[key];
//     } else {
//       newObj[key] = obj[key];
//     }
//   }
//   return newObj;
// }
// const newObj = renameKeys(solved_formState, 'tournament_');
// console.log(newObj);

// <!-- <div
// class="ml-4 relative"
// @click="handleAddCustomCreatedProject"
// v-if="
//   index ===
//   t_create_custom_created_projects_detail.length - 1
// "
// >
// <div
//   class="i-carbon-add-filled text-24px text-#8989A1 absolute hover:opacity-80 active:opacity-50"
// ></div>
// <div
//   class="i-carbon-add-filled?bg text-24px text-amber bg-#292968 rounded-full hover:bg-opacity-80 active:opacity-50"
// ></div>
// </div> -->
