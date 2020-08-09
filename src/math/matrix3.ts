import { Matrix4 } from '.';

export class Matrix3 {
  // Identity matrix
  data: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  fromRotationPart(m: Matrix4): Matrix3 {
    this.data[0] = m.data[0];
    this.data[1] = m.data[1];
    this.data[2] = m.data[2];

    this.data[3] = m.data[4];
    this.data[4] = m.data[5];
    this.data[5] = m.data[6];
    
    this.data[6] = m.data[8];
    this.data[7] = m.data[9];
    this.data[8] = m.data[10];

    return this;
  }

  inverse(): Matrix3 {
    const m = this.data;
    const det = m[0] * (m[4] * m[8] - m[5] * m[7])
      - m[3] * (m[1] * m[8] - m[7] * m[2])
      + m[6] * (m[1] * m[7] - m[4] * m[2]);
    const invdet = 1. / det;

    const result: number[] = [
      (m[4] * m[8] - m[5] * m[7]) * invdet,
      (m[6] * m[5] - m[3] * m[8]) * invdet,
      (m[3] * m[7] - m[6] * m[4]) * invdet,
      (m[7] * m[2] - m[1] * m[8]) * invdet,
      (m[0] * m[8] - m[6] * m[2]) * invdet,
      (m[1] * m[6] - m[0] * m[7]) * invdet,
      (m[1] * m[5] - m[2] * m[4]) * invdet,
      (m[2] * m[3] - m[0] * m[5]) * invdet,
      (m[0] * m[4] - m[1] * m[3]) * invdet,
    ];

    this.data = result;

    return this;
  }

  transpose(): Matrix3 {
    let temp: number;
    let m = this.data;

    let swap = (i: number, j: number) => {
      temp = m[i];
      m[i] = m[j];
      m[j] = temp;
    };

    swap(1, 3);
    swap(2, 6);
    swap(5, 7);

    return this;
  }
}
