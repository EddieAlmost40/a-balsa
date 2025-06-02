// Esqueleto de jogo em Babylon.js com câmera em terceira pessoa (atrás do jogador)
import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Ray } from "@babylonjs/core";
import "@babylonjs/loaders";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const createScene = () => {
    const scene = new Scene(engine);

    // Jogador (caixa em primeiro plano)
    const player = MeshBuilder.CreateBox("player", { size: 1 }, scene);
    player.position = new Vector3(0, 0.5, -47);

    // Câmera posicionada atrás do jogador
    const camera = new UniversalCamera("camera", new Vector3(0, 3, -15), scene);
    camera.setTarget(new Vector3(0, 0.5, 0));
    camera.attachControl(canvas, true);

    // Luz
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Rio (plano azul)
    const river = MeshBuilder.CreateGround("river", { width: 120, height: 90 }, scene);
    const riverMat = new StandardMaterial("riverMat", scene);
    riverMat.diffuseColor = new Color3(0, 0.5, 1);
    river.material = riverMat;

    // Balsa (caixa no fundo do rio)
    const raft = MeshBuilder.CreateBox("raft", { width: 10, height: 0.5, depth: 10 }, scene);
    raft.position = new Vector3(0, 0.5, 30);

    let pulling = false;

    // Clique para lançar a corda
    scene.onPointerDown = () => {
        const direction = raft.position.subtract(player.position).normalize();
        const ray = new Ray(player.position, direction, 80);

        if (ray.intersectsMesh(raft)) {
            pulling = true;
        }
    };

    // Puxar a balsa
    scene.onBeforeRenderObservable.add(() => {
        if (pulling) {
            const toPlayer = player.position.subtract(raft.position);
            if (toPlayer.length() > 0.2) {
                raft.position.addInPlace(toPlayer.normalize().scale(0.1));
            }
        }
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
