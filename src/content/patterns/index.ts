import { PatternContent } from "@/types/pattern";

import { factoryMethodContent } from "./factory-method";
import { abstractFactoryContent } from "./abstract-factory";
import { builderContent } from "./builder";
import { prototypeContent } from "./prototype";
import { singletonContent } from "./singleton";
import { adapterContent } from "./adapter";
import { bridgeContent } from "./bridge";
import { compositeContent } from "./composite";
import { decoratorContent } from "./decorator";
import { facadeContent } from "./facade";
import { flyweightContent } from "./flyweight";
import { proxyContent } from "./proxy";
import { chainOfResponsibilityContent } from "./chain-of-responsibility";
import { commandContent } from "./command";
import { iteratorContent } from "./iterator";
import { mediatorContent } from "./mediator";
import { mementoContent } from "./memento";
import { observerContent } from "./observer";
import { stateContent } from "./state";
import { strategyContent } from "./strategy";
import { templateMethodContent } from "./template-method";
import { visitorContent } from "./visitor";

const ALL_PATTERNS: Record<string, PatternContent> = {
  "factory-method": factoryMethodContent,
  "abstract-factory": abstractFactoryContent,
  builder: builderContent,
  prototype: prototypeContent,
  singleton: singletonContent,
  adapter: adapterContent,
  bridge: bridgeContent,
  composite: compositeContent,
  decorator: decoratorContent,
  facade: facadeContent,
  flyweight: flyweightContent,
  proxy: proxyContent,
  "chain-of-responsibility": chainOfResponsibilityContent,
  command: commandContent,
  iterator: iteratorContent,
  mediator: mediatorContent,
  memento: mementoContent,
  observer: observerContent,
  state: stateContent,
  strategy: strategyContent,
  "template-method": templateMethodContent,
  visitor: visitorContent,
};

export function getPatternContent(slug: string): PatternContent | undefined {
  return ALL_PATTERNS[slug];
}
