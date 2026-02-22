"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { marked } from "marked";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  contactInfo: {
    fontSize: 9,
    color: "#666",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#000",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  subHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#000",
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  itemContent: {
    flex: 1,
  },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  link: { color: "#000", textDecoration: "none" },
});

function InlineContent({ tokens }) {
  if (!tokens || tokens.length === 0) return null;
  return (
    <Text>
      {tokens.map((t, i) => {
        if (t.type === "text") return <Text key={i}>{t.text}</Text>;
        if (t.type === "strong")
          return (
            <Text key={i} style={styles.bold}>
              <InlineContent tokens={t.tokens} />
            </Text>
          );
        if (t.type === "em")
          return (
            <Text key={i} style={styles.italic}>
              <InlineContent tokens={t.tokens} />
            </Text>
          );
        if (t.type === "codespan")
          return (
            <Text key={i} style={{ fontFamily: "Courier", fontSize: 10 }}>
              {t.text}
            </Text>
          );
        if (t.type === "link")
          return (
            <Text key={i} style={styles.link}>
              <InlineContent tokens={t.tokens} />
            </Text>
          );
        if (t.type === "br") return <Text key={i}>{"\n"}</Text>;
        if (t.type === "escape" || t.type === "html")
          return <Text key={i}>{t.text}</Text>;
        if (t.tokens) return <InlineContent key={i} tokens={t.tokens} />;
        return <Text key={i}>{t.raw || t.text || ""}</Text>;
      })}
    </Text>
  );
}

function BlockContent({ token }) {
  if (!token) return null;
  switch (token.type) {
    case "paragraph":
      return (
        <View style={styles.paragraph}>
          <InlineContent tokens={token.tokens} />
        </View>
      );
    case "heading":
      if (token.depth === 1) {
        return <Text style={styles.name}>{token.text}</Text>;
      }
      return (
        <View
          style={token.depth === 2 ? styles.sectionHeading : styles.subHeading}
        >
          <Text>
            <InlineContent tokens={token.tokens} />
          </Text>
        </View>
      );
    case "code":
      return <Text style={styles.code}>{token.text}</Text>;
    case "blockquote":
      return (
        <View style={styles.blockquote}>
          {(token.tokens || []).map((t, i) => (
            <BlockContent key={i} token={t} />
          ))}
        </View>
      );
    case "list":
      return (
        <View style={{ marginBottom: 8 }}>
          {(token.items || []).map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.itemContent}>
                {(item.tokens || []).length > 0 &&
                item.tokens[0]?.type === "paragraph" ? (
                  <InlineContent tokens={item.tokens[0].tokens} />
                ) : (
                  <Text>{item.text || ""}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      );
    case "hr":
      return <View style={styles.hr} />;
    case "space":
      return <View style={{ height: 8 }} />;
    case "table":
      return (
        <View style={styles.table}>
          {token.header && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              {token.header.map((cell, i) => (
                <View key={i} style={styles.tableCell}>
                  <InlineContent tokens={cell.tokens} />
                </View>
              ))}
            </View>
          )}
          {(token.rows || []).map((row, ri) => (
            <View key={ri} style={styles.tableRow}>
              {row.map((cell, ci) => (
                <View key={ci} style={styles.tableCell}>
                  <InlineContent tokens={cell.tokens} />
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    case "html":
      return (
        <View style={styles.paragraph}>
          <Text>{token.text}</Text>
        </View>
      );
    default:
      return null;
  }
}

// Helper to group header elements
function ResumeHeader({ nameToken, contactToken }) {
  if (!nameToken && !contactToken) return null;

  return (
    <View style={styles.header}>
      {nameToken && <Text style={styles.name}>{nameToken.text}</Text>}
      {contactToken && (
        <View style={styles.contactInfo}>
          <InlineContent tokens={contactToken.tokens} />
        </View>
      )}
    </View>
  );
}

export default function ResumePDFDocument({ content }) {
  // Strip HTML tags and emojis for PDF
  const src = (content || "")
    .replace(/<[^>]*>/g, "")
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    );
  let tokens = [];
  try {
    tokens = marked.lexer(src);
  } catch {
    tokens = [];
  }

  // Find header tokens
  const nameTokenIndex = tokens.findIndex(
    (t) => t.type === "heading" && (t.depth === 1 || t.depth === 2),
  );
  const contactTokenIndex = tokens.findIndex(
    (t, i) => i > 0 && t.type === "paragraph",
  );

  const nameToken = nameTokenIndex !== -1 ? tokens[nameTokenIndex] : null;
  const contactToken =
    contactTokenIndex !== -1 ? tokens[contactTokenIndex] : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ResumeHeader nameToken={nameToken} contactToken={contactToken} />
        {tokens
          .filter((_, i) => i !== nameTokenIndex && i !== contactTokenIndex)
          .map((token, i) => (
            <BlockContent key={i} token={token} />
          ))}
      </Page>
    </Document>
  );
}
