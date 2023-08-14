// TODO: config provider
// name input

// export const metadata = {
//   title: "Character Profile",
//   description: "Honkai Star Rail Character Profile & Character Card",
// };

export default async function Profile() {
  return (
    <main>
      <div>uid here</div>
      <div>lang select</div>
    </main>
  );
}

const IMG_REPO = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master";
export const img = (suffix: string) =>
  suffix.startsWith("/") ? IMG_REPO + suffix : IMG_REPO + "/" + suffix;
