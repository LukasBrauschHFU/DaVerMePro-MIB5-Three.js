import {
    Matrix3,
    Matrix4,
    Vector3,
    Mesh,
    Quaternion,
    Geometry,
    BufferGeometry,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    LineSegments,
} from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import { BaseTurtle } from './BaseTurtle'

export class Turtle3D extends BaseTurtle {
    render(scene: THREE.Scene): void {
        console.time('Geometry creation')

        const material = new LineBasicMaterial({ vertexColors: true })
        let lineVertices: number[] = []
        const bufferGeometry: BufferGeometry = new BufferGeometry()
        const colorsArray: number[] = []

        for (let i: number = 0; i < this.instructionString.length; i++) {
            switch (this.instructionString.charAt(i)) {
                case 'F': //Move and draw line in current direction
                    const currentPositionBeforeMove = this.currentPosition.clone()

                    let newColors = [
                        Math.random() * 0.5 + 0.5,
                        Math.random() * 0.5 + 0.5,
                        Math.random() * 0.5 + 0.5,
                    ]

                    lineVertices.push(
                        currentPositionBeforeMove.x,
                        currentPositionBeforeMove.y,
                        currentPositionBeforeMove.z
                    )
                    colorsArray.push(...newColors)

                    this.move()

                    const currentPositionAfterMove = this.currentPosition.clone()
                    lineVertices.push(
                        currentPositionAfterMove.x,
                        currentPositionAfterMove.y,
                        currentPositionAfterMove.z
                    )
                    colorsArray.push(...newColors)

                    break
                case 'G': //Move in current direction
                    this.move()
                    break
                case '[':
                    this.saveState()
                    break
                case ']':
                    this.loadState()
                    break
                case '+':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 0, 1),
                            this.rotationStepSize
                        )
                    )
                    break
                case '-':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 0, -1),
                            this.rotationStepSize
                        )
                    )
                    break
                case '&':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, 1, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '∧': //Achtung, ∧ (mathematisches UND) und nicht ^ :D
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(0, -1, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '\\':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(1, 0, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '/':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(-1, 0, 0),
                            this.rotationStepSize
                        )
                    )
                    break
                case '|':
                    this.currentRotation.multiply(
                        new Quaternion().setFromAxisAngle(
                            new Vector3(1, 0, 0),
                            Math.PI
                        )
                    )
                    break
                default:
                    console.log(
                        'Unknown axiom character: ' +
                            this.instructionString.charAt(i)
                    )
                    break
            }
        }

        // console.log('Vertices', lineVertices)

        bufferGeometry.setAttribute(
            'position',
            new Float32BufferAttribute(lineVertices, 3)
        )
        bufferGeometry.setAttribute(
            'color',
            new Float32BufferAttribute(colorsArray, 3)
        )

        const line = new LineSegments(bufferGeometry, material)
        scene.add(line)

        console.timeEnd('Geometry creation')
    }

    move(): void {
        let absoluteMovement: Vector3 = new Vector3(0, 1, 0)
            .applyQuaternion(this.currentRotation.clone())
            .multiplyScalar(this.stepLength)

        this.currentPosition.add(absoluteMovement)
    }
}
