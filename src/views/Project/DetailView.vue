<template>
  <div class="page">
    <NavBar></NavBar>
    <div class="content-container">
      <div class="project-header">
        <div class="title">Single-cell RNA sequencing reveals compromised immune microenvironment in precursor stages of
          multiple myeloma
        </div>
        <a-typography-paragraph
            class="desc"
            :ellipsis="{rows:2,expandable:true, symbol:'more'}"
            :content="desc"
        ></a-typography-paragraph>
        <div class="tags">
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 2</a-tag>
          <a-tag>Tag 3</a-tag>
        </div>
      </div>
      <div class="project-body">
        <div class="left">
          <div class="top">
            <div class="fill"/>
            <a class="interactive">Interactive Viewer</a>
            <div class="group-desc">Static UMAP group by</div>
          </div>
          <div class="bottom">
            <div class="umap"></div>
            <div class="umap-types">
              <div class="type">Cell Type</div>
              <div class="type">Sample</div>
              <div class="type active">sex</div>
              <div class="type">Treatment</div>
            </div>
          </div>
        </div>
        <div class="right">
          <a-tabs type="card" size="large" :tab-bar-gutter="8" class="h-full">
            <template #leftExtra>
              <div class="fix-fill"></div>
            </template>
            <a-tab-pane key="1" tab="Celltype Markers">
              <div class="bg-amber-100 h-full">123</div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Cell type distribution">Content of Tab Pane 2</a-tab-pane>
            <a-tab-pane key="3" tab="Score of pathway">Content of Tab Pane 3</a-tab-pane>
            <a-tab-pane key="4" tab="Download">Content of Tab Pane 3</a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="project-footer">
        <div>Publication : xxx aacbecekdede gogogesdepnfejde</div>
        <div>Email : xyz@shanghaiitech.edu.cn</div>
      </div>
    </div>
  </div>

</template>
<script setup>
import NavBar from '@/components/NavBar.vue'
import { ref } from 'vue'

const desc = ref(` Single-cell RNA sequencing reveals compromised immune microenvironment in precursor stages
          ofPrecursor states of Multiple Myeloma (MM) and its native tumeor microenvironment need in-depth molecular
          characterizationto better stratify and treat patients at risk. Using single-cell RNA sequencing of bone marrow
          cells from precursor stages, MGUS and
          Single-cell RNA sequencing reveals compromised immune microenvironment in precursor stages
          ofPrecursor states of Multiple Myeloma (MM) and its native tumeor microenvironment need in-depth molecular
          characterizationto better stratify and treat patients at risk. Using single-cell RNA sequencing of bone marrow
          cells from precursor stages, MGUS and
          Single-cell RNA sequencing reveals compromised immune microenvironment in precursor stages
          ofPrecursor states of Multiple Myeloma (MM) and its native tumeor microenvironment need in-depth molecular
          characterizationto better stratify and treat patients at risk. Using single-cell RNA sequencing of bone marrow
          cells from precursor stages, MGUS and`)

</script>
<style scoped lang="scss">
.page {
  background: #F0F2F5;
  min-height: 100vh;
}

.content-container {
  display: flex;
  padding-top: 12px;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  .project-header {
    display: flex;
    padding: 0.625rem 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
    align-self: stretch;

    .title {
      color: #5F5F5F;
      font-size: 1.5rem;
      font-weight: 400;
      line-height: 1.375rem; /* 91.667% */
    }

    .desc {
      color: #7E7E7E;
      font-size: 1rem;
      font-weight: 400;
    }
  }

  .project-body {
    display: flex;
    align-items: stretch;
    gap: 0.625rem;

    .left {
      display: flex;
      height: 34.75rem;
      flex-direction: column;
      align-items: stretch;

      .top {
        display: flex;
        height: 4rem;
        align-items: stretch;
        flex-shrink: 0;
        gap: 0.38rem;
        border-radius: 0 2.5rem 0 0;
        overflow: hidden;

        .fill {
          background: #0081D8;
          width: 1.625rem;
        }

        .interactive {
          display: flex;
          padding: 0 1.25rem;
          align-items: center;
          background: #00A9DD;
          color: #FFF;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .group-desc {
          flex: 1;
          background: #0081D8;
          display: flex;
          padding: 1rem 1.25rem;
          justify-content: flex-end;
          align-items: center;
          gap: 0.625rem;
          align-self: stretch;
          color: #FFF;
          font-size: 1.25rem;
          font-weight: 500;
        }
      }

      .bottom {
        background: #0081D8;
        display: flex;
        align-items: stretch;

        .umap {
          width: 30.75rem;
          height: 30.75rem;
          padding: 1.5rem;
          box-sizing: border-box;
          background: #fff;
        }

        .umap-types {
          display: flex;
          flex-direction: column;
          align-items: stretch;

          .type {
            color: #FFF;
            padding: 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            text-transform: capitalize;
            border-bottom: 1px solid rgba(255, 255, 255, 0.20);
            text-align: center;
            cursor: pointer;

            &.active {
              background: #FF7555;
            }
          }
        }

      }
    }

    .right {
      width: 0;
      flex: 1;

      .fix-fill {
        height: 2.5rem;
        width: 0.75rem;
        border-radius: 0.625rem 0 0 0;
        background: #0081D8;
      }

      :deep(.ant-tabs-nav) {

        margin-bottom: 0 !important;

        .ant-tabs-nav-wrap {
          .ant-tabs-tab {
            height: 2.5rem;
            width: 11.625rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7E7E7E;
            background: #DFE2E8;
            border-radius: 0.625rem 0.625rem 0 0;
            border: none;

            &:first-child {
              border-radius: 0 0.625rem 0 0;
            }

            &.ant-tabs-tab-active {
              background: #0081D8;

              .ant-tabs-tab-btn {
                color: #FFFFFF;
              }
            }
          }
        }

      }

      :deep(.ant-tabs-content-holder) {
        padding-left: 0.75rem;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          background: #0081D8;
          width: 0.75rem;
          height: 100%;
        }
      }
    }
  }

  .project-footer {
    display: flex;
    padding: 0.75rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    div {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5rem; /* 150% */
      color: #5F5F5F;
      padding: 0.5rem;
    }
  }
}
</style>
