
export interface coordinates {
  x :number
  y: number
}
export type ShapeConstructor =  {
  startPoint: {
    x: number
    y: number
  },
  lastPoint: {
    x: number
    y: number
  },
}


export type StyleConstructor = {
  radius: number ;
  lineWidth: number;
  fillColor: string;
  strokeColor: string;
}
