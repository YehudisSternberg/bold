"use client";

import { BackButton } from "@/src/comps/BackButton/BackButton";
import { Details } from "@/src/comps/Details/Details";
import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import { POOLS } from "@/src/demo-data";
import { css } from "@/styled-system/css";
import { HFlex, Tabs, TokenIcon, TokenIconGroup } from "@liquity2/uikit";
import { useParams, useRouter } from "next/navigation";
import { DepositPanel } from "./DepositPanel";
import { RewardsPanel } from "./RewardsPanel";
import { WithdrawPanel } from "./WithdrawPanel";

const TABS = [
  { action: "deposit", label: content.earnScreen.tabs.deposit },
  { action: "withdraw", label: content.earnScreen.tabs.withdraw },
  { action: "claim", label: content.earnScreen.tabs.claim },
] as const;

export function EarnPoolScreen() {
  const { pool: poolName, action = "deposit" } = useParams();

  const router = useRouter();
  const pool = POOLS.find(({ symbol }) => symbol.toLowerCase() === poolName);
  const tab = TABS.find((tab) => tab.action === action);

  return pool && tab && (
    <Screen>
      <BackButton href="/earn" label={content.earnScreen.backButton} />
      <PoolSummary pool={pool} />
      {pool.deposit && (
        <Details
          items={[
            {
              label: content.earnScreen.accountPosition.depositLabel,
              value: pool.deposit,
            },
            {
              label: content.earnScreen.accountPosition.rewardsLabel,
              value: pool.rewards && (
                <HFlex
                  gap={8}
                  justifyContent="flex-start"
                  className={css({
                    fontSize: 14,
                    color: "positive",
                  })}
                >
                  {pool.rewards.bold} BOLD
                  <div
                    className={css({
                      display: "flex",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "dimmed",
                    })}
                  />
                  {pool.rewards.eth} ETH
                </HFlex>
              ),
            },
          ]}
        />
      )}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
        })}
      >
        <Tabs
          selected={TABS.indexOf(tab)}
          onSelect={(index) => {
            router.push(`/earn/${poolName}/${TABS[index].action}`, {
              scroll: false,
            });
          }}
          items={TABS.map((tab) => ({
            label: tab.label,
            panelId: `panel-${tab.action}`,
            tabId: `tab-${tab.action}`,
          }))}
        />
        {tab.action === "deposit" && <DepositPanel pool={pool} />}
        {tab.action === "withdraw" && <WithdrawPanel pool={pool} />}
        {tab.action === "claim" && <RewardsPanel pool={pool} />}
      </div>
    </Screen>
  );
}

function PoolSummary({ pool }: { pool: typeof POOLS[number] }) {
  return (
    <div
      className={css({
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
      })}
    >
      <div
        className={css({
          display: "flex",
          width: "100%",
          gap: 24,
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            paddingTop: 8,
          })}
        >
          <TokenIconGroup size="large">
            <TokenIcon symbol="BOLD" />
            <TokenIcon symbol={pool.symbol} />
          </TokenIconGroup>
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          })}
        >
          <div
            className={css({
              fontSize: 24,
            })}
          >
            {pool.token} pool
          </div>
          <div
            className={css({
              color: "contentAlt",
              whiteSpace: "nowrap",
            })}
          >
            {content.earnScreen.headerTvl(pool.boldQty)}
          </div>
        </div>
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
        })}
      >
        <div
          className={css({
            fontSize: 24,
          })}
        >
          {pool.apy}
        </div>
        <div
          className={css({
            color: "contentAlt",
            whiteSpace: "nowrap",
          })}
        >
          {content.earnScreen.headerApy()}
        </div>
      </div>
    </div>
  );
}