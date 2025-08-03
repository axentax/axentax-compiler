import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [
    dts(),
    // terserはrollupOptionsで設定
  ],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'Conductor',
      fileName: (format) => {
        // if (format === 'umd') return `conductor.${format}.js`;
        if (format === 'es') return `conductor.js`;
      },
      formats: ['es'] // ESで出力 ,'umd'
    },
    minify: false, // Viteデフォルトの圧縮を無効化
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: false,
            beautify: false,
            preserve_annotations: false
          },
          compress: {
            keep_fargs: false,
            pure_funcs: ['console.info', 'console.debug'],

            // 高度な圧縮設定
            passes: 2, // マルチパス圧縮
            hoist_funs: true, // 関数宣言のホイスティング
            hoist_vars: true, // 変数宣言のホイスティング
            pure_getters: true, // プロパティアクセス最適化
            booleans_as_integers: true, // ブール値の整数変換
            unsafe: true, // 高度な変換を許可
            unsafe_comps: true, // 比較演算子最適化
            unsafe_math: true, // 数学演算最適化
            unsafe_symbols: true, // シンボル最適化
            unsafe_methods: true, // メソッド最適化
            unsafe_proto: true, // プロトタイプメソッド最適化
            unsafe_undefined: true // undefined最適化
          },
          mangle: {
            toplevel: true, // トップレベルの変数や関数も難読化
            properties: {
              regex: /^_/,
              // regex: /./, // こっちにすれば難読化されるが { sss: 111 } の項目名も変更される
              // 以下のオプションを有効にすると、すべてのプロパティ名が難読化される
              // ただし、外部から参照される可能性のあるプロパティ名は難読化されないように注意
              keep_quoted: true, // クォートされたプロパティ名は難読化しない
              // reserved: ['reservedPropertyName1', 'reservedPropertyName2'], // 難読化しないプロパティ名を指定
            },
          },
        }),
      ],
    },
    // sourcemap: true, // 必要に応じてソースマップを有効化
  },
  server: {
    open: true
  }
});
