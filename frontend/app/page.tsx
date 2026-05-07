const highlights = [
  {
    title: '環境情報付き投稿',
    description: '言語・フレームワーク・OS・バージョンをまとめて記録し、再現性を高めます。',
  },
  {
    title: '解決率スコア',
    description: '解決できた件数を可視化し、信頼できる投稿を判断しやすくします。',
  },
  {
    title: 'チーム共有',
    description: 'コメントとタグで、同じエラーの知見をチーム内で蓄積できます。',
  },
];

const steps = [
  'エラーを投稿する',
  '環境情報を記録する',
  '解決方法を共有する',
  '解決率で信頼性を確認する',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_36%),linear-gradient(180deg,#fff7ed_0%,#fff_38%,#f8fafc_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm backdrop-blur">
          FixLog beta foundation
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              エラー解決を、<span className="text-orange-500">共有可能な資産</span>に変える。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              FixLogは、開発中に発生したエラーとその解決方法を、環境情報と一緒に記録・共有するためのナレッジ共有Webアプリケーションです。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5" href="#highlights">
                機能を見る
              </a>
              <a className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600" href="#flow">
                使い方を見る
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-orange-300">投稿プレビュー</p>
              <p className="mt-3 text-xl font-bold">TypeError: Cannot read property...</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                React コンポーネントで state 初期化前に参照していたため、null チェックを追加して解決。
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Language</p>
                  <p className="font-semibold">TypeScript</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">OS</p>
                  <p className="font-semibold">Windows</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Framework</p>
                  <p className="font-semibold">Next.js</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Success Rate</p>
                  <p className="font-semibold">85%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="highlights" className="mt-16 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>

        <section id="flow" className="mt-10 rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-bold text-slate-950">開発フロー</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">0{index + 1}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
